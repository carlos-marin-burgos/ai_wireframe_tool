/**
 * Figma Code Connect mapping for ImageUploadModal
 * This file connects the React component to the Figma design system
 */

import { figma } from '@figma/code-connect'
import ImageUploadModal from './ImageUploadModal'

figma.connect(
    ImageUploadModal,
    'https://www.figma.com/design/wSppVRlOi9JZO2LxtHUbbW/Fluent-2-Extended-Figma-Library?node-id=YOUR_MODAL_NODE_ID',
    {
        props: {
            // Map Figma properties to React props
            isOpen: figma.boolean('Visible'),
            isAnalyzing: figma.boolean('Loading State'),
            // Add more prop mappings as needed
        },
        example: (props) => (
            <ImageUploadModal
                isOpen={props.isOpen}
                onClose={() => { }}
                onImageUpload={(file: File) => { }}
                onAnalyzeImage={(imageUrl: string, fileName: string) => { }}
                isAnalyzing={props.isAnalyzing}
                {...props}
            />
        ),
    }
)
