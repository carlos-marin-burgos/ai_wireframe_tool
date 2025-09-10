import React from 'react';

interface ComponentPreviewProps {
    componentCode: string;
    componentName?: string;
}

const ComponentPreview: React.FC<ComponentPreviewProps> = ({
    componentCode
}) => {
    // Simply render the HTML content directly without any wrapper or titles
    return (
        <div dangerouslySetInnerHTML={{ __html: componentCode }} />
    );
};

export default ComponentPreview;
