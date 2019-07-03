import Vue from "vue";

export default function CreatePage(app) {
    new Vue({
        render: (h) => h(app)
    }).$mount("#app")
}