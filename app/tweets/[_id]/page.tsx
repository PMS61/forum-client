"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import ReadTweet from "@/app/components/readTweet";
import ReplyTweet from "./reply";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import mongoose from "mongoose";

type incDataType = {
  _id: string,
  userID: string,
  post: string,
  replies: string[],
  img: any,
  username: string,
  upvoteIds: [mongoose.Schema.Types.ObjectId];
  downvoteIds: [mongoose.Schema.Types.ObjectId];
};
type replyDataType = {
  _id: any | undefined;
  userId: string | undefined;
  postId: string | undefined;
  reply: string | undefined;
  replies: number
  img:string,
  writterId: string | undefined;
  writterName: string | undefined;
  upvoteIds: [mongoose.Schema.Types.ObjectId];
  downvoteIds: [mongoose.Schema.Types.ObjectId];
};
export default function Page({ params }: { params: { _id: string } }) {
  let selector = useSelector((state: RootState) => state.toggle2.value);
  let [incData2, setIncData2] = useState<incDataType>();
  let [replyData, setReplyData] = useState<replyDataType[]>();
  useEffect(() => {
    let fetch = async () => {
      try {
        await axios.post("http://localhost:4000/getSpecificTweet", {
          _id: params._id,
        }).then((res) => {
          setIncData2(res.data);
        });
        await axios.post("http://localhost:4000/getReplies", {
          _id: params._id,
        }).then((res) => setReplyData(res.data))
      } catch (e: any) {
        console.log(e.message);
      }
    };
    fetch();
  }, [selector]);
  return (
    <div className="mx-96">
      <ReadTweet
        username={incData2?.username}
        post={incData2?.post}
        replies={incData2?.replies.length}
        img={incData2?.img}
        _id={incData2?._id}
        hier={false}
        upvoteIds={incData2?.upvoteIds}
        downvoteIds={incData2?.downvoteIds}
        isReply={false}
      />
      <ReplyTweet userId={incData2?.userID} postId={incData2?._id} />
      {replyData?.map((e, i) => (
        <ReadTweet
          username={e.writterName}
          post={e.reply}
          replies={0}
          img={e.img}
          _id={e._id}
          hier={false}
          upvoteIds={e?.upvoteIds}
          downvoteIds={e?.downvoteIds}
          isReply={true}
          key={i}
        />
      ))}
    </div>
  );
}
