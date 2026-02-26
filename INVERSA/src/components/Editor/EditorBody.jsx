import { useState, useEffect } from "react";
import EditorNavigation from "./EditorNavigation";
import EditorActions from "./EditorActions";
import TextEditorSection from "./TextEditorSection";

const EditorBody = ({
  chapter,
  chapters,
  onSelectChapter,
  onSave,
  loading,
  onBack,
  isInitiator,
}) => {
  const [title, setTitle] = useState("");
  const [sections, setSections] = useState([]);

  useEffect(() => {
    if (chapter) {
      setTitle(chapter.title || "");
      setSections(chapter.sections || []);
    }
  }, [chapter]);

  const addTextSection = () => {
    setSections([
      ...sections,
      {
        id: Date.now(),
        type: "text",
        content: "",
      },
    ]);
  };

  const addImageSection = () => {
    setSections([
      ...sections,
      {
        id: Date.now(),
        type: "image",
        imageUrl: "",
        caption: "",
      },
    ]);
  };

  const updateSection = (id, newData) => {
    setSections(sections.map(sec =>
      sec.id === id ? { ...sec, ...newData } : sec
    ));
  };

  const deleteSection = (id) => {
    setSections(sections.filter(sec => sec.id !== id));
  };

  const handleImageUpload = (id, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      updateSection(id, { imageUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (publish = false) => {
    onSave(
      {
        id: chapter?.id,
        title,
        sections,
      },
      publish
    );
  };

  if (!chapter) {
    return (
      <div className="card p-8 text-center">
        No chapter selected.
      </div>
    );
  }

  return (
    <>
      {/* TITLE */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Chapter Title"
        className="text-3xl font-bold w-full mb-6 bg-transparent"
      />

      {/* ADD SECTION BUTTONS */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={addTextSection}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Add Text
        </button>

        <button
          onClick={addImageSection}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Add Image
        </button>
      </div>

      {/* RENDER SECTIONS */}
      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.id} className="card p-6 relative">

            {/* DELETE BUTTON */}
            <button
              onClick={() => deleteSection(section.id)}
              className="absolute top-4 right-4 text-red-500"
            >
              ✕
            </button>

            {section.type === "text" && (
              <TextEditorSection
                content={section.content}
                onChange={(html) =>
                  updateSection(section.id, { content: html })
                }
              />
            )}

            {section.type === "image" && (
              <div>
                {section.imageUrl ? (
                  <div className="w-full h-[300px] rounded-xl overflow-hidden mb-4">
                    <img
                      src={section.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(section.id, e.target.files[0])
                    }
                  />
                )}

                <input
                  type="text"
                  placeholder="Caption (optional)"
                  value={section.caption}
                  onChange={(e) =>
                    updateSection(section.id, { caption: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg bg-white dark:bg-dark-surface"

                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* NAVIGATION */}
      {chapters && chapters.length > 0 && (
        <EditorNavigation
          chapters={chapters}
          currentChapter={chapter}
          onSelectChapter={onSelectChapter}
        />
      )}

      {/* ACTIONS */}
      <EditorActions
        onBack={onBack}
        onSaveDraft={() => handleSave(false)}
        onPublish={() => handleSave(true)}
        loading={loading}
        isInitiator={isInitiator}
        chapterStatus={chapter?.status}
      />
    </>
  );
};

export default EditorBody;