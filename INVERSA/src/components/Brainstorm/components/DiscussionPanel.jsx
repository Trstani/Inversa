import React, { useState} from 'react';
import { FiSend, FiMessageCircle, FiTrash2 } from 'react-icons/fi';
import { apiClient } from '../../../api/client';

const DiscussionPanel = ({ 
  projectId, 
  brainstorm, 
  user,
  onDiscussionAdded,
  onDiscussionDeleted,
}) => {
  const [newDiscussion, setNewDiscussion] = useState('');

  const discussions=
  brainstorm?.discussions||[];

    const handleAddDiscussion =
  async()=>{
  
  if(
  !newDiscussion.trim()
  )return;
  
  try{
  
  const response=
  await apiClient
  .brainstorm
  .addDiscussion(
  projectId,
  {
  message:newDiscussion
  }
  );
  
  setNewDiscussion('');
  
  onDiscussionAdded?.(
  response.data
  );
  
  }
  catch(error){
  
  console.error(error);
  
  }
  
  };
  
   const handleDeleteDiscussion=
  async(id)=>{
  
  try{
  
  await apiClient
  .brainstorm
  .deleteDiscussion(id);
  
  onDiscussionDeleted?.(
  id
  );
  
  }
  catch(error){
  
  console.error(
  error
  );
  
  }
  
  };

  return (
    <div className="card p-4 h-full flex flex-col bg-light-surface dark:bg-dark-surface">
      <h3 className="font-semibold text-light-primary dark:text-dark-primary mb-4 flex items-center gap-2"><FiMessageCircle className="w-4 h-4" />Discussion</h3>
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-0">
        {discussions.length === 0 ? (
          <div className="text-center py-8 text-light-secondary dark:text-dark-secondary text-sm"><p>No discussions yet</p></div>
        ) : (
          discussions.map((discussion) => (
            <div key={discussion.id} className="bg-light-background dark:bg-dark-background p-3 rounded-xl">
              <div className="flex justify-between items-start gap-3">
                {/* LEFT */}
                <div className="flex-1">
                  <p className="font-medium text-xs text-light-primary dark:text-dark-primary">
                    {discussion.name || "Unknown"}
                  </p>
                  <p className="text-xs text-light-secondary dark:text-dark-secondary mt-1 whitespace-pre-wrap">
                    {discussion.message}
                  </p>
                  <p className="text-xs text-light-secondary/50 dark:text-dark-secondary/50 mt-2">
                    {new Date(discussion.created_at).toLocaleTimeString()}
                  </p>
                </div>
                {/* DELETE */}
                {discussion.user_id === user?.id && (
                  <button
                    onClick={() => handleDeleteDiscussion(discussion.id)}
                    className="text-red-500 hover:text-red-600 transition shrink-0"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex gap-2">
        <textarea
          value={newDiscussion}
          onChange={(e) => setNewDiscussion(e.target.value)}
          placeholder="Add discussion..."
          className="flex-1 px-3 py-2 text-sm rounded resize-none min-h-[40px] max-h-[120px] bg-white border-black dark:bg-dark-background dark:border-dark-primary"
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAddDiscussion(); } }}
        />
        <button onClick={handleAddDiscussion} disabled={!newDiscussion.trim()} className="px-3 py-2 bg-light-accent dark:bg-dark-accent text-white rounded hover:opacity-90 disabled:opacity-50 transition">
          <FiSend className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default DiscussionPanel;