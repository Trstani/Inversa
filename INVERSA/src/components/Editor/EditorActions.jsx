// components/editor/EditorActions.jsx
import Button from "../Button";

const EditorActions = ({ onBack, onSaveDraft, onPublish, loading, isInitiator, chapterStatus }) => {
  return (
    <div className="flex justify-between items-center">
      <Button variant="ghost" onClick={onBack}>
        Back
      </Button>

      {isInitiator ? (
        <div className="space-x-3">
          <Button 
            variant="outline" 
            onClick={onSaveDraft} 
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Draft"}
          </Button>
          <Button 
            variant="primary" 
            onClick={onPublish} 
            disabled={loading}
          >
            {loading ? "Publishing..." : "Publish"}
          </Button>
        </div>
      ) : (
        <div className="text-sm text-gray-500">
          {chapterStatus === "published" ? "Published" : "Draft"}
        </div>
      )}
    </div>
  );
};

export default EditorActions;
