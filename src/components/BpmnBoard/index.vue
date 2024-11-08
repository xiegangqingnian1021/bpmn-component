<template>
  <div class="app-container">
    <div class="containerBox">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" size="mini" @click="handleUndo">后退</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" size="mini" @click="handleRedo">前进</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" size="mini" @click="handleDownload">下载</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-upload
              style="display: inline-block;"
              :file-list="fileList"
              action=""
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleOnchangeFile"
              :on-remove="handleRemove"
              :before-remove="beforeRemove">
            <el-button type="danger" size="mini">导入</el-button>
          </el-upload>
        </el-col>
        <el-col :span="1.5">
          <el-button size="mini" @click="handlePreview">预览</el-button>
        </el-col>
      </el-row>
      <!-- div 原class  class="bpmn-canvas"-->
      <div
          ref="canvas"
          :style="{width: 100 * scale + '%',height: 100 * scale + '%'}"></div>
      <BpmnPreview :open="openDialog" @close="closeBpmnPreview"/>
    </div>
  </div>
</template>

<script>

import BpmnModeler from "bpmn-js/lib/Modeler";
import CustomPalette from "./customPalette/index.js";
import camundaExtension from './customPalette/resources/camunda.json';
import BpmnPreview from "../BpmnPreview/index.vue";

export default {
  name: 'BpmnBoard',
  components: {
    BpmnPreview
  },
  data() {
    return {
      files: null,
      fileList: [],
      bpmnModeler: null,
      canvas: null,
      scale: 1,
      openDialog: false,
      customIdPrefix: ''
    };
  },
  methods: {
    /**
     * 关闭预览
     */
    closeBpmnPreview() {
      this.openDialog = false;
    },

    /**
     * 初始化Bpmn画板
     */
    async init() {
      // 获取画布 element
      this.canvas = this.$refs.canvas;
      // 创建Bpmn对象
      this.bpmnModeler = new BpmnModeler({
        container: this.canvas,
        //moddleExtensions: {camunda: camundaExtension},
        additionalModules: [
          CustomPalette, //自定义节点
        ],
      });
      await this.create();
    },
    /**
     * 创建初始图表
     */
    async create() {
      this.bpmnModeler.createDiagram(() => {
        this.bpmnModeler.get('canvas').zoom('fit-viewport');
      });
    },

    /**
     * 移除图表
     * @param file
     */
    handleRemove(file) {
      for (let i = 0; i < this.fileList.length; i++) {
        if (file.name === this.fileList[i].name) {
          this.fileList.splice(i, 1);
        }
      }
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    /**
     * 导入Bpmn文件
     * @param file
     */
    handleOnchangeFile(file) {
      const reader = new FileReader();
      let data = '';
      reader.readAsText(file.raw);
      reader.onload = (event) => {
        data = event.target.result;
        this.bpmnModeler.importXML(data, (err) => {
          if (err) {
            this.$message.info('导入失败');
          } else {
            this.$message.success('导入成功');
          }
        });
      };
    },

    /**
     * 撤销
     */
    handleUndo() {
      this.bpmnModeler.get('commandStack').undo();
    },

    /**
     * 前进
     */
    handleRedo() {
      this.bpmnModeler.get('commandStack').redo();
    },

    /**
     * 下载
     */
    handleDownload() {
      this.bpmnModeler.saveXML(
          {format: true},
          (err, data) => {
            const dataTrack = 'bpmn';
            const a = document.createElement('a');
            const name = `diagram.${dataTrack}`;

            a.setAttribute(
                'href',
                `data:application/bpmn20-xml;charset=UTF-8,${encodeURIComponent(data)}`
            );
            a.setAttribute('target', '_blank');
            a.setAttribute('dataTrack', `diagram:download-${dataTrack}`);
            a.setAttribute('download', name);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          });
    },

    /**
     * 打开预览
     */
    handlePreview() {
      this.openDialog = true;
    },

    /**
     * 注册鼠标事件
     */
    registryMouseEvent() {
      // 为节点注册鼠标进入事件
      const eventBus = this.bpmnModeler.get('eventBus');
      const overlays = this.bpmnModeler.get('overlays');
      eventBus.on('element.hover', (e) => {
        const overlayHtml = document.createElement('div');
        overlayHtml.innerText = '节点ID:' + e.element.id;
        overlayHtml.style.width = '100px';
        overlayHtml.style.height = '30px';
        overlayHtml.style.textAlign = 'center';
        overlays.add(e.element.id, {
          position: {top: e.element.height, left: 0},
          html: overlayHtml
        });
      });
      // 为节点注册鼠标离开事件
      eventBus.on('element.out', () => {
        overlays.clear();
      });
    }

  },
  mounted() {
    this.init();
    //this.registryMouseEvent();
  },
  created() {
  }
}
</script>

<style scoped lang="scss">
.containerBox {
  height: calc(100vh - 220px);
  position: relative;

  #container {
    height: calc(100% - 50px);
  }
}
</style>
