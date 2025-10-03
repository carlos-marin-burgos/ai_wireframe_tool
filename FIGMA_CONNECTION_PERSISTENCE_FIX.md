# Figma Connection Persistence Fix

## Issue

The Figma connection was being lost when users closed the Figma Integration Modal (by clicking the X close button). This caused users to have to re-authenticate every time they reopened the modal, even though the session data was stored in localStorage.

## Root Cause

The modal's close handler was directly calling `onClose()` without any logic to preserve the connection state. While the localStorage session data remained intact, there was no explicit mechanism to:

1. Extend the session when closing the modal
2. Document that the session should persist across modal open/close cycles
3. Distinguish between "closing the modal" vs "disconnecting from Figma"

## Solution

Implemented a dedicated `handleClose` callback that:

1. **Preserves the session** - Does NOT clear any Figma authentication data
2. **Extends the session** - Automatically extends the trusted session by 7 days when closing the modal while connected
3. **Logs behavior** - Adds clear console logs to track session preservation
4. **Separates concerns** - Distinguishes between modal close (X button) and explicit disconnect (Disconnect button)

### Code Changes

#### 1. Added `handleClose` Handler

```typescript
const handleClose = useCallback(() => {
  // IMPORTANT: Do NOT clear the Figma session when closing the modal
  // The session should persist so users stay connected across modal open/close cycles
  // Only the explicit "Disconnect" button should clear the session
  console.log("🚪 Closing Figma modal - preserving connection state");

  // Extend the session on close to maintain connectivity
  if (isConnected) {
    extendTrustedSession();
    console.log("🔄 Extended Figma session on modal close");
  }

  onClose();
}, [isConnected, onClose]);
```

#### 2. Updated Close Button

Changed from:

```typescript
<button className="figma-modal-close" onClick={onClose} ...>
```

To:

```typescript
<button className="figma-modal-close" onClick={handleClose} ...>
```

#### 3. Added Documentation Comment

Added clear comments to the `useEffect` hook that handles modal opening to document the intended behavior:

```typescript
// IMPORTANT: When modal closes, DO NOT clear the connection
// The session should persist across modal open/close cycles
// Only clear session when user explicitly clicks "Disconnect"
```

## Behavior After Fix

### When User Closes Modal (X Button)

✅ Figma connection remains active
✅ Session is extended by 7 more days
✅ OAuth tokens remain in localStorage
✅ Next time modal opens, user is still connected
✅ Can immediately import designs without re-authenticating

### When User Clicks Disconnect Button

✅ Connection is properly cleared
✅ OAuth tokens are removed
✅ Session data is cleared
✅ User must re-authenticate to use Figma features

## Session Management

- **Session Duration**: 7 days (extended on each modal close)
- **Storage**: localStorage with keys:
  - `figma_oauth_session` - Trusted session metadata
  - `figma_oauth_tokens` - OAuth access tokens
  - `figma_oauth_timestamp` - Token creation time
- **Auto-Extension**: Session is extended when:
  - Modal is opened while connected
  - Modal is closed while connected
  - Session data is accessed

## Testing

To verify the fix:

1. Connect to Figma using OAuth or manual token
2. Import a design successfully
3. Close the modal (X button)
4. Reopen the modal
5. ✅ Should show "Connected to Figma" status
6. ✅ Should allow immediate design import
7. ✅ No re-authentication required

## Files Modified

- `/src/components/FigmaIntegrationModal.tsx`
  - Added `handleClose` callback
  - Updated close button handler
  - Added documentation comments

## Related Code

- Session management: `readTrustedSession()`, `persistTrustedSession()`, `extendTrustedSession()`
- Disconnect handler: `handleDisconnect()` - Still properly clears session when needed
- OAuth flow: Unaffected, continues to work as expected
