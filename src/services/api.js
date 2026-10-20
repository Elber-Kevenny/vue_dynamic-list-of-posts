const URL_BASE = "https://mate.academy/students-api"

const getUsers = async () => {
  try {
    const response = await fetch(URL_BASE + "/users")
    if (!response.ok) {
      throw new Error(`Erro no fetch: ${response.status}`)
    } return await response.json()
  } catch (e) {
    console.log('Erro interno', e.message)
  }
}


const getUser = async (param) => {
    try {
    const response = await fetch(URL_BASE + "/users?email=" + param)
    if (!response.ok) {
      throw new Error(`Erro no fetch: ${response.status}`)
    } return await response.json()
  } catch (e) {
    console.log('Erro interno', e.message)
  }
}
const postUser = async (userCadastro) => {
    try {
      const response = await fetch(URL_BASE + "/users", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userCadastro)
    })
    if (!response.ok) {
      throw new Error(`Erro no fetch: ${response.status}`)
    } return await response.json()
  } catch (e) {
    console.log('Erro interno', e.message)
  }
}

const getPost = async (id) => {
   try {
      const response = await fetch(URL_BASE + "/posts?userId=" + id)
    if (!response.ok) {
      throw new Error(`Erro no fetch: ${response.status}`)
    } return await response.json()
  } catch (e) {
    console.log('Erro interno', e.message)
  }
}

const addPost = async (postCadastro) => {
  try {
    const response = await fetch(URL_BASE + "/posts", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postCadastro), 
  })

  if (!response.ok) {
      throw new Error(`Erro ao adicionar o post: ${response.status}`)
  } return response.json();
  } catch (e) {
    console.error("erro interno ao adicionar post", e.message)
  }
}

const getComment = async (id) => {
    try {
      const response = await fetch(URL_BASE + "/comments?postId=" + id)
    if (!response.ok) {
      throw new Error(`Erro no fetch: ${response.status}`)
    } return await response.json()
  } catch (e) {
    console.log('Erro interno no getComent', e.message)
  }
}

const addComent = async (commentCadastro) => {
   try {
    const response = await fetch(URL_BASE + "/comments", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(commentCadastro), 
  })

  if (!response.ok) {
      throw new Error(`Erro ao adicionar o post: ${response.status}`)
  } return response.json();
  } catch (e) {
    console.error("erro interno ao adicionar post", e.message)
  }
}
const updatePost = async (update) => {
   try {
    const response = await fetch(URL_BASE + "/posts/" + update.postId, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(update), 
  })

  if (!response.ok) {
      throw new Error(`Erro ao adicionar o post: ${response.status}`)
  } return response.json();
  } catch (e) {
    console.error("erro interno ao aeditar post", e.message)
  }
}
const deletePost = async (postId) => {
   try {
    const response = await fetch(URL_BASE + "/posts/" + postId, {
    method: "DELETE",
  })

  if (!response.ok) {
      throw new Error(`Erro ao adicionar o post: ${response.status}`)
  } return response.json();
  } catch (e) {
    console.error("erro interno ao aeditar post", e.message)
  }
}
const deleteComment = async (commentId) => {
   try {
    const response = await fetch(URL_BASE + "/comments/" + commentId, {
    method: "DELETE",
  })

  if (!response.ok) {
      throw new Error(`Erro ao deletar comentario: ${response.status}`)
  } return response.json();
  } catch (e) {
    console.error("erro interno ao deletar o comentario", e.message)
  }
}

const fun = {
  getUser,
  getUsers,
  postUser,
  getPost,
  addPost,
  getComment,
  addComent,
  updatePost,
  deletePost,
  deleteComment,
}

export default fun;