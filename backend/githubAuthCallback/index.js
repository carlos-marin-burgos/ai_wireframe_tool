// Handles GitHub OAuth callback: exchanges code for access token, posts message to opener window
// WARNING: Dev-only; token is returned to client. For production, store securely server-side.

const stateStore = require("../githubAuthState");

module.exports = async function (context, req) {
  const { code, state, error } = req.query || {};
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const redirectUri =
    process.env.GITHUB_REDIRECT_URL ||
    "http://localhost:7072/api/github/auth/callback";

  const htmlResponse = (script) => ({
    status: 200,
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
    },
    body: `<!DOCTYPE html><html><head><title>GitHub Auth</title></head><body><script>${script}</script></body></html>`,
  });

  if (error) {
    context.res = htmlResponse(
      `window.opener&&window.opener.postMessage({source:'github-auth',status:'error',error:${JSON.stringify(
        error
      )}},'*');window.close();`
    );
    return;
  }
  if (!code || !state) {
    context.res = htmlResponse(
      "window.opener&&window.opener.postMessage({source:'github-auth',status:'error',error:'Missing code or state'},'*');window.close();"
    );
    return;
  }
  if (!clientId || !clientSecret) {
    context.res = htmlResponse(
      "window.opener&&window.opener.postMessage({source:'github-auth',status:'error',error:'Server not configured'},'*');window.close();"
    );
    return;
  }

  // Validate state
  if (!stateStore.consume(state)) {
    context.res = htmlResponse(
      "window.opener&&window.opener.postMessage({source:'github-auth',status:'error',error:'Invalid state'},'*');window.close();"
    );
    return;
  }

  try {
    const tokenRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: redirectUri,
          state,
        }),
      }
    );

    const json = await tokenRes.json();
    if (json.error) {
      context.res = htmlResponse(
        `window.opener&&window.opener.postMessage({source:'github-auth',status:'error',error:${JSON.stringify(
          json.error
        )}},'*');window.close();`
      );
      return;
    }

    const accessToken = json.access_token;
    const scope = json.scope;
    const tokenType = json.token_type;

    // Optionally fetch user login
    let login = null;
    try {
      if (accessToken) {
        const userRes = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": "designetica-dev",
          },
        });
        const user = await userRes.json();
        login = user.login || null;
      }
    } catch (_) {}

    context.res = htmlResponse(
      `window.opener&&window.opener.postMessage({source:'github-auth',status:'success',token:'${accessToken}',tokenType:'${tokenType}',scope:'${scope}',login:${JSON.stringify(
        login
      )}},'*');window.close();`
    );
  } catch (e) {
    context.log.error("GitHub callback error", e);
    context.res = htmlResponse(
      `window.opener&&window.opener.postMessage({source:'github-auth',status:'error',error:${JSON.stringify(
        e.message
      )}},'*');window.close();`
    );
  }
};
