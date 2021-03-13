<template>
  <div class="container">
    <div class="main-wrap">
      <el-image
        style="width: 650px; height: auto"
        src="https://bgr.com/wp-content/uploads/2019/11/avengers-endgame-iron-man-gauntlet.jpg?quality=70&strip=all"
        fit="fit">
      </el-image>
      <h2>In Memory of Tony Stark</h2>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'first',
      showTeam: false,
    }
  },
  mounted() {
    if (document.body.clientWidth > 1200 && document.body.clientWidth < 1330) {
      this.showTeam = true
    }
  },
  methods: {
    handleArticle(link) {
      window.open(link)
    },
  },
}
</script>

<style scoped lang="scss">
.container {
  padding: 20px;

  .main-wrap {
    width: 650px;
    margin: 0 auto;
    text-align: center;
    padding: 20px;
    border: 2px dotted #b1a3a3;

    h2 {
      font-size: 25px;
      line-height: 1.5;
      padding: 5px 0;
      //border: 3px dotted #d6b1b1;
      margin-top: 5px;
      background-color: #000000;
      color: white;
      font-weight: 800;
    }
  }
}

@media screen and (max-width: 1200px) {
  .container .lin-info .lin-info-right {
    display: none;
  }
  .container .lin-info .lin-info-left {
    width: 100%;
  }
  .container .quantity-statistics .quantity-item {
    width: 32%;
    &:last-child {
      display: none;
    }
  }
  .container .information .personal {
    display: none;
  }
}

@media screen and (max-width: 1200px) {
  .container .lin-info .lin-info-left {
    width: 100%;
  }
}
</style>
