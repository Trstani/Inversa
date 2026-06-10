import React,{
  useState,
  useRef
} from 'react';

import {
  FiSend,
  FiMessageCircle,
  FiTrash2
} from 'react-icons/fi';

import {
  apiClient
} from '../../../api/client';

const DiscussionPanel=({
  projectId,
  brainstorm,
  user,
  onDiscussionAdded,
  onDiscussionDeleted,
})=>{

  const [
    newDiscussion,
    setNewDiscussion
  ]=useState('');

  const [
    isSending,
    setIsSending
  ]=useState(false);

  const sendingRef=
    useRef(false);

  const discussions=
    brainstorm?.discussions||[];

  const handleAddDiscussion=
  async()=>{

    if(
      !newDiscussion.trim() ||
      sendingRef.current
    ){
      return;
    }

    try{

      sendingRef.current=true;
      setIsSending(true);

      await onDiscussionAdded(
        newDiscussion.trim()
      );

      setNewDiscussion('');

    }
    catch(error){

      console.error(error);

    }
    finally{

      setTimeout(()=>{

        sendingRef.current=false;
        setIsSending(false);

      },800);

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

      console.error(error);

    }

  };

  return(

    <div id="discussion" className="card p-4 h-full flex flex-col bg-light-surface dark:bg-dark-surface">

      <h3 className="font-semibold text-light-primary dark:text-dark-primary mb-4 flex items-center gap-2">

        <FiMessageCircle className="w-4 h-4"/>
        Discussion

      </h3>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-0">

        {discussions.length===0 ? (

          <div className="text-center py-8 text-light-secondary dark:text-dark-secondary text-sm">

            No discussions yet

          </div>

        ) : (

          discussions.map(
            discussion=>(

              <div
                key={discussion.id}
                className="bg-light-background dark:bg-dark-background p-3 rounded-xl"
              >

                <div className="flex justify-between items-start gap-3">

                  <div className="flex-1">

                    <p className="font-medium text-xs">

                      {discussion.name || "Unknown"}

                    </p>

                    <p className="text-xs mt-1 whitespace-pre-wrap">

                      {discussion.message}

                    </p>

                    <p className="text-xs opacity-50 mt-2">

                      {
                        discussion.created_at
                        ? new Date(
                            discussion.created_at
                          ).toLocaleTimeString()
                        : ""
                      }

                    </p>

                  </div>

                  {discussion.user_id===user?.id && (

                    <button
                      onClick={()=>
                        handleDeleteDiscussion(
                          discussion.id
                        )
                      }
                      className="text-red-500"
                    >

                      <FiTrash2 className="w-4 h-4"/>

                    </button>

                  )}

                </div>

              </div>

            )
          )

        )}

      </div>

      <div className="flex gap-2">

        <textarea
          value={newDiscussion}

          onChange={(e)=>
            setNewDiscussion(
              e.target.value
            )
          }

          placeholder="Add discussion..."

          className="flex-1 px-3 py-2 text-sm rounded resize-none min-h-[40px] max-h-[120px] bg-white border-black dark:bg-dark-background"

          onKeyDown={(e)=>{

            if(
              e.key==="Enter" &&
              !e.shiftKey
            ){

              e.preventDefault();

              handleAddDiscussion();

            }

          }}
        />

        <button
          onClick={
            handleAddDiscussion
          }

          disabled={
            !newDiscussion.trim() ||
            isSending
          }

          className="px-3 py-2 bg-light-accent dark:bg-dark-accent text-white rounded disabled:opacity-50"
        >

          <FiSend className="w-4 h-4"/>

        </button>

      </div>

    </div>

  );

};

export default DiscussionPanel;