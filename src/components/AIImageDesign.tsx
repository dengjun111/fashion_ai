import React from "react";
import './AIImageDesign.css'

const EditorPanel: React.FC = () => {
    return <div className="AIImage-edit-panel">
        <h1 className="editor-title">灵感绘图</h1>
    </div>
}

const ResultPanel: React.FC = () => {
    return <div className="AIImage-result-panel"></div>
}

const AIImageDesign: React.FC = () => {
    return <div className="AIImage-Design-container">
        <EditorPanel />
        <ResultPanel />
    </div>
}

export default AIImageDesign;