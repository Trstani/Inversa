import { useState,useEffect } from 'react';
import { apiClient } from '../../api/client';

const useBrainstorm=(projectId)=>{

const [session,setSession]=useState({
  ideas:[],
  tasks:[],
  discussions:[],
  notes:[]
});

const [loading,setLoading]=useState(true);

useEffect(()=>{

 if(!projectId)return;

 loadSession();

},[projectId]);

const loadSession=async()=>{

 try{

  setLoading(true);

  const [
    sessionRes,
    ideasRes,
    tasksRes,
    discussionsRes,
    notesRes
  ]=await Promise.all([

    apiClient.brainstorm.getSession(projectId),
    apiClient.brainstorm.getIdeas(projectId),
    apiClient.brainstorm.getTasks(projectId),
    apiClient.brainstorm.getDiscussions(projectId),
    apiClient.brainstorm.getNotes(projectId)

  ]);

  setSession({

    ...sessionRes.data,

    ideas:ideasRes.data||[],
    tasks:tasksRes.data||[],
    discussions:discussionsRes.data||[],
    notes:notesRes.data||[]

  });

 }
 catch(err){

   console.error(err);

 }
 finally{

   setLoading(false);

 }

};

const addNewIdea=async(
userId,
userName,
title,
chapter_id=null
)=>{

 const res=
 await apiClient.brainstorm.addIdea(
   projectId,
   {
     user_id:userId,
     user_name:userName,
     title,
     chapter_id
   }
 );

 return res.data;

};

const removeIdea=
async(id)=>{

 await apiClient
 .brainstorm
 .deleteIdea(projectId,id);

};

const vote=
async(id)=>{

 await apiClient
 .brainstorm
 .voteIdea(projectId,id);

};

const createTask=
async(data)=>{

 const res=
 await apiClient
 .brainstorm
 .addTask(
   projectId,
   data
 );

 return res.data;

};

const updateTaskStatus=
async(id,updates)=>{

 const res=
 await apiClient
 .brainstorm
 .updateTask(
   projectId,
   id,
   updates
 );

 return res.data;

};

const removeTask=
async(id)=>{

 await apiClient
 .brainstorm
 .deleteTask(
   projectId,
   id
 );

};

const addDiscussion=
async(message)=>{

 const res=
 await apiClient
 .brainstorm
 .addDiscussion(
   projectId,
   {message}
 );

 return res.data;

};

const addNote=
async(content)=>{

 const res=
 await apiClient
 .brainstorm
 .addNote(
   projectId,
   {content}
 );

 return res.data;

};

return{

 session,
 setSession,
 loading,

 addNewIdea,
 removeIdea,
 vote,

 createTask,
 updateTaskStatus,
 removeTask,

 addDiscussion,
 addNote

};

};

export default useBrainstorm;