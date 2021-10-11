import Vue from "vue";
import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8081/",
  json: true
});

export default {
  async execute(method, resource, data) {
    // inject the accessToken for each request
    let accessToken = await Vue.prototype.$auth.getAccessToken();
    return client({
      method,
      url: resource,
      data,
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      getPosts() {
        return this.execute("get", "/posts");
      },
      getPost(id) {
        return this.execute("get", `/posts/${id}`);
      },
      createPost(data) {
        return this.execute("post", "/posts", data);
      },
      updatePost(id, data) {
        return this.execute("put", `/posts/${id}`, data);
      },
      deletePost(id) {
        return this.execute("delete", `/posts/${id}`);
      },
      async refreshPosts () {
        this.loading = true
        this.posts = await api.getPosts()
        this.loading = false
      },

      async savePost () {
        if (this.model.id) {
          await api.updatePost(this.model.id, this.model)
        } else {
          await api.createPost(this.model)
        }
        this.model = {} // reset form
        await this.refreshPosts()
      },

      async populatePostToEdit (post) {
        this.model = Object.assign({}, post)
      },
      async deletePost (id) {
        if (confirm('Are you sure you want to delete this post?')) {
          await api.deletePost(id)
          await this.refreshPosts()
        }
      }
    }).then(req => {
      return req.data;
    });
  }
};
