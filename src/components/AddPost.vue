<script setup>
import { usePostStore } from '@/store/postStore.js';
import InputField from './InputField.vue';
import TextAreaField from './TextAreaField.vue';
import { computed, ref, watch } from 'vue';


const props = defineProps({
  isComment: { type: Boolean, default: false },
  isEditing: { type: Boolean, default: false },
  postToEdit: { type: Object, default: null }
});

const isErrorPostTitle = ref(false);

const commentAuthor = ref("");
const isErrorAuthor = ref(false);
const commentEmail = ref("");
const isErrorEmail = ref(false);

const isErrorPostBody = ref(false);



const globalState = usePostStore()
const userId = JSON.parse(localStorage.getItem("user"))?.id

const postList = computed(() => globalState.state.postsList || []);

const currentPost = computed(() =>
  postList.value.find((post) => globalState.state.activePostId === post.id),
);

const postTitle = ref(props.isEditing ? currentPost.value.title : "");
const postBody = ref(props.isEditing ? currentPost.value.body : "");

watch(
  () => [props.isEditing, currentPost.value],
  ([isEditing, post]) => {
    if (isEditing && post) {
      postTitle.value = post.title || "";
      postBody.value = post.body || "";
    }
  },
  { immediate: true, deep: true }
);
console.log("post addpost", currentPost.value);

console.log("userId para postagem", userId)


const handleSubmit = async () => {
  if (props.isEditing) {
    // Lógica de Edição (Valida Título e Corpo)
    if (postTitle.value && postBody.value) {
      const realPostId = currentPost.value.id.value !== undefined 
        ? currentPost.value.id.value 
        : currentPost.value.id
      await globalState.fetchUpdatePost({
        postId: Number(realPostId),
        userId,
        title: postTitle.value,
        body: postBody.value
      });
    } else {
      // CORRIGIDO: Valida os campos corretos da edição
      isErrorPostTitle.value = !postTitle.value;
      isErrorPostBody.value = !postBody.value;
    }
  } else if (props.isComment) {
    // Validação e envio de Comentário
    if (commentAuthor.value && commentEmail.value && postBody.value) {
      await globalState.fetchAddComment({
        postId: globalState.state.activePostId,
        name: commentAuthor.value,
        email: commentEmail.value,
        body: postBody.value
      });
      globalState.handleShowFormComment(false);
      
      // Limpa os erros de comentário após o sucesso (opcional mas recomendado)
      isErrorAuthor.value = false;
      isErrorEmail.value = false;
      isErrorPostBody.value = false;
    } else {
      // ADICIONADO: O 'else' que faltava para marcar os erros de comentário se falhar
      isErrorAuthor.value = !commentAuthor.value;
      isErrorEmail.value = !commentEmail.value;
      isErrorPostBody.value = !postBody.value;
    }
  } else {
    // Validação e envio de Post Novo
    if (postTitle.value && postBody.value) {
      await globalState.fecthAddPost({
        userId,
        title: postTitle.value,
        body: postBody.value
      });
    } else {
      isErrorPostTitle.value = !postTitle.value;
      isErrorPostBody.value = !postBody.value;
    }
  }
};

// onMounted(() => {

// })
</script>

<template>
  
  <form @submit.prevent="handleSubmit()">
    
    <!-- SE FOR COMENTÁRIO: Mostra Autor e E-mail -->
    <template v-if="isComment">
      <InputField 
        v-model="commentAuthor" 
        v-model:isError="isErrorAuthor" 
        isComment 
      />
      <InputField 
        v-model="commentEmail" 
        v-model:isError="isErrorEmail" 
        isEmail 
      />
    </template>

    <!-- SE FOR POST (Criação ou Edição): Mostra apenas o Título -->
    <template v-else>
      <InputField 
        v-model="postTitle" 
        v-model:isError="isErrorPostTitle" 
      />
    </template>

    <!-- O corpo (textarea) é comum para os dois! -->
    <TextAreaField 
      v-model="postBody" 
      v-model:isError="isErrorPostBody" 
    />

    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-link" >
          {{ isEditing ? "Save" : (isComment ? "Add a comment" : "Save") }}
        </button>
      </div>
      <div class="control">
        <button 
          type="reset" 
          class="button is-link is-light" 
          @click="isEditing ? globalState.handleIsEditing(false) : (globalState.handleShowPost(false), globalState.handleShowFormComment(false))"
        >
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>
