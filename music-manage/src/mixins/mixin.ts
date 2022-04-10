import { getCurrentInstance } from "vue";
import { LocationQueryRaw } from "vue-router";
import { RouterName } from "@/enums";

interface routerOptions {
  path?: string;
  query?: LocationQueryRaw;
}

export default function () {
  const { proxy } = getCurrentInstance();

  function changeSex(value) {
    if (value === 0) {
      return "女";
    } else if (value === 1) {
      return "男";
    } else if (value === 2) {
      return "组合";
    } else if (value === 3) {
      return "不明";
    } else if (value === "男" || value === "女") {
      return value;
    }
  }

  function beforeAvatarUpload(file) {
    const isJPG = file.type === "image/jpeg" || file.type === "image/png";
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isJPG) {
      (proxy as any).$message.error("上传头像图片只能是 JPG 格式!");
    }
    if (!isLt2M) {
      (proxy as any).$message.error("上传头像图片大小不能超过 2MB!");
    }
    return isJPG && isLt2M;
  }

  function beforeSongUpload(file) {
    const testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
    const extension = testmsg === "mp3";
    if (!extension) {
      (proxy as any).$message({
        message: "上传文件只能是mp3格式！",
        type: "error",
      });
    }
    return extension;
  }

  function getBirth(cellValue) {
    if (cellValue == null || cellValue == "") return "";
    const date = new Date(cellValue);
    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return year + "-" + month + "-" + day;
  }
  // 路由管理
  function routerManager(routerName: string | number, options: routerOptions) {
    switch (routerName) {
      case RouterName.Song:
      case RouterName.ListSong:
      case RouterName.Comment:
      case RouterName.Consumer:
      case RouterName.Collect:
        proxy.$router.push({ path: options.path, query: options.query });
        break;
      case RouterName.Home:
      case RouterName.SignIn:
      case RouterName.SignOut:
      case RouterName.Info:
      case RouterName.Singer:
      case RouterName.SongList:
      case RouterName.Error:
      default:
        proxy.$router.push({ path: options.path });
        break;
    }
  }

  function goBack(step = -1) {
    proxy.$router.go(step);
  }

  return { getBirth, changeSex, routerManager, goBack, beforeAvatarUpload, beforeSongUpload };
}
