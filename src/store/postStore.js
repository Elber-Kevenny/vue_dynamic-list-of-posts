import fun from "@/services/api";
import { reactive, readonly } from "vue";

const state = reactive({
  postsList: [],
  commentList: [],
  commentBody: null,
  isComment: false,
  postBody: null,
  showCreatePost: false,
  showComments: false,
  activePostId: null,
  isLoading: false,
  isLoadingComment: false,
  isEditing: false,
});

export const usePostStore = () => {
  const handleShowPost = (isShow) => {
    state.showCreatePost = isShow;
    if (isShow) {
      state.activePostId = null;
      state.showComments = false;
      state.isComment = false;
    }
  };

  const handleToggleComments = (postId) => {
    if (state.activePostId === postId) {
      state.showComments = !state.showComments;
      if (!state.showComments) {
        state.activePostId = null;
        state.isComment = false;
        state.isEditing = false;
        state.postBody = null;
      }
    } else {
      state.activePostId = postId;
      state.showComments = true;
      state.isComment = false;
      state.isEditing = false;

    }
    state.showCreatePost = false;
  };

  const posts = async (user) => {
    
  try {
    if (user) {
      const userId = user.value ? user.value.id : user
       user.value ? state.isLoading = true : state.isLoading = false
    const data = await fun.getPost(userId);
    state.postsList = data
  } return
  } catch (e) {
    console.error("Erro ao exibir a lista de posts", e.message)
  } finally {
    state.isLoading = false;
  }

  }

  const fecthAddPost = async (postCadastro) => {
    try {
      const data = await fun.addPost(postCadastro)
      if (data) {
        state.postBody = data
        state.showCreatePost = false;
        state.showComments = true;
        state.activePostId = data.id;

        await posts(postCadastro.userId)
      }
    } catch (e) {
      console.error("erro interno", e.message)
    }
  }

  const handleIsLoading = (param) => {
    state.isLoading = param
  }

  const fetchComment = async (id) => {
    state.commentList = []
    try {
      if (id) {
      state.isLoadingComment = true
      const data = await fun.getComment(id)
      state.commentList = data
      }
      
    } catch (e) {
      console.error("Erro no fetch comment", e.message)
    } finally {
      state.isLoadingComment = false;

    }

  }
  const fetchAddComment = async (comment) => {
    await fun.addComent(comment);
    await fetchComment(comment.postId)
  }

  const handleShowFormComment = (param) => {
    state.isComment = param
  }
  const handleIsEditing = (param) => {
    state.isEditing = param;
    state.isComment = false;
    console.log("isEditing", state.isEditing)
  }
  const fetchUpdatePost = async (updatedData) => {
  try {
    const data = await fun.updatePost({title: updatedData.title, body: updatedData.body, userId: updatedData.userId, postId: updatedData.postId}); // Certifique-se que sua service tem essa função
    if (data) {
      // Atualiza a lista localmente ou recarrega os posts
      await posts(updatedData.userId);
      state.isEditing = false;
    }
  } catch (e) {
    console.error("Erro ao atualizar post", e.message);
  }
  };
  const fetchDeletePost = async (postId) => {
    try {
     
      const data = await fun.deletePost(postId);

      
      if (data) {
        state.postsList = state.postsList.filter((post) => post.id !== postId);
      }

      
      if (state.activePostId === postId) {
        state.activePostId = null;
        state.postBody = null;
        state.isEditing = false;
        state.showComments = false;
      }
    } catch (e) {
      console.error("Erro ao deletar post:", e.message);
    }
  };
  const fetchDeleteComment = async (commentId) => {
    try {
      // 1. Chamada para a API (ajuste 'fun.deleteComment' para o nome do seu serviço de api)
      await fun.deleteComment(commentId);

      // 2. Remove o comentário da lista localmente para atualizar a UI instantaneamente
      state.commentList = state.commentList.filter((comment) => comment.id !== commentId);
    } catch (e) {
      console.error("Erro ao deletar comentário:", e.message);
    }
  };

  console.log("coments", state.commentList)
  console.log("isComment", state.isComment)
console.log("create post", state.showCreatePost)
  
  return {
    state: readonly(state),
    handleShowPost,
    handleToggleComments,
    posts,
    fecthAddPost,
    handleIsLoading,
    fetchComment,
    handleShowFormComment,
    fetchAddComment,
    handleIsEditing,
    fetchUpdatePost,
    fetchDeletePost,
    fetchDeleteComment
  };
};
