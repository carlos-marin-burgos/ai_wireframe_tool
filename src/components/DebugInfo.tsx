import React from 'react';

interface DebugInfoProps {
    htmlWireframe: string;
    wireframePages: any[];
    currentPageId: string | null;
}

const DebugInfo: React.FC<DebugInfoProps> = ({ htmlWireframe, wireframePages, currentPageId }) => {
    return (
        <div style={{
            position: 'fixed',
            top: '50px',
            left: '10px',
            background: 'black',
            color: 'white',
            padding: '10px',
            fontSize: '12px',
            zIndex: 9999,
            borderRadius: '4px',
            maxWidth: '300px'
        }}>
            <div>Has wireframe: {htmlWireframe ? 'YES' : 'NO'}</div>
            <div>Wireframe length: {htmlWireframe?.length || 0}</div>
            <div>Pages count: {wireframePages?.length || 0}</div>
            <div>Current page: {currentPageId || 'none'}</div>
            <div>Should show nav: {(htmlWireframe || wireframePages.length > 0) ? 'YES' : 'NO'}</div>
        </div>
    );
};

export default DebugInfo;
