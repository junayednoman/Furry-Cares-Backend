import { defaultImage } from "../../constant";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import PostModel from "./post.model";
import { postServices } from "./post.service";

const createPost = handleAsyncRequest(async (req, res) => {
  const thumbnail = req?.file?.path || defaultImage
  const bodyData = req.body
  const postData = {
    thumbnail,
    ...bodyData
  }


  const result = await postServices.createPostIntoDb(postData)
  successResponse((res), {
    message: "Post created successfully!", data: result,
  })
})

const getAllPosts = handleAsyncRequest(async (req, res) => {
  const result = await postServices.getAllPostFromDb(req.query)
  successResponse((res), {
    message: 'Posts retrieved successfully!', data: result,
  })
})

const getPostById = handleAsyncRequest(async (req, res) => {
  const result = await postServices.getSinglePostFromDb(req.params.id)
  successResponse((res), {
    message: "Post retrieved successfully!", data: result,
  })
})

const updateSinglePost = handleAsyncRequest(async (req, res) => {
  const bodyData = req.body
  let thumbnail
  const oldPost = await PostModel.findById(req.params.id)
  if (req.file) {
    thumbnail = req.file?.path
  } else {
    thumbnail = oldPost?.thumbnail
  }
  const postData = {
    thumbnail,
    ...bodyData
  }

  const retrievedToken = req.headers.authorization
  const token = retrievedToken?.split('Bearer, ')[1]

  const result = await postServices.updateSinglePost(req.params.id, postData, token!)
  successResponse((res), {
    message: "Post updated successfully!", data: result,
  })
})

const updatePostVote = handleAsyncRequest(async (req, res) => {
  const postId = req.body.postId
  const userId = req.body.userId
  const type = req.body.voteType
  const result = await postServices.updatePostVote(postId, userId, type)
  successResponse((res), {
    message: "Post vote updated successfully!", data: result,
  })
})

const deletePost = handleAsyncRequest(async (req, res) => {
  const retrievedToken = req.headers.authorization
  const token = retrievedToken?.split('Bearer, ')[1]
  const result = await postServices.deletePost(req.params.id, token!)
  successResponse((res), {
    message: "Post deleted successfully!", data: result,
  })
})

const getPostByUser = handleAsyncRequest(async (req, res) => {
  const result = await postServices.getPostByUser(req.params.userId, req.query)
  successResponse((res), {
    message: "Post retrieved successfully!", data: result,
  })
})

const updatePostPublishStatus = handleAsyncRequest(async (req, res) => {
  const retrievedToken = req.headers.authorization
  const token = retrievedToken?.split('Bearer, ')[1]
  const isPublished = req.body.isPublished
  const result = await postServices.updatePostPublishStatus(req.params.id, isPublished, token!)

  successResponse((res), {
    message: `Post ${isPublished ? 'published' : 'drafted'} successfully!`, data: result,
  })
})


export const postControllers = {
  createPost,
  getAllPosts,
  getPostById,
  updateSinglePost,
  updatePostVote,
  deletePost,
  getPostByUser,
  updatePostPublishStatus
}