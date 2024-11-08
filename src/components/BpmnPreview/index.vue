<template>
  <el-dialog :model-value="open" title="预览"
             width="1000"
             style="height: 800px"
             :show-close="false"
             close-on-click-modal="false" >
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button  type="warning" plain   @click="closeDialog">关闭</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" @click="scale += 1">放大</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" @click="scale -= 1">缩小</el-button>
      </el-col>
    </el-row>
    <div ref="preview_canvas" class="containerBox"
         v-bind:style="{width: 100 * scale + '%', height: 100 * scale}"></div>
  </el-dialog>
</template>

<script>
import BpmnViewer from 'bpmn-js/lib/Viewer';

export default {
  name: "BpmnPreview",
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scale: 1,
      bpmnViewer: null,
      currentCanvasXml: `
        <?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1">
      <bpmn:outgoing>Flow_021z3si</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:serviceTask id="Activity_1fru9kc" name="我是第一个节点">
      <bpmn:incoming>Flow_021z3si</bpmn:incoming>
      <bpmn:outgoing>Flow_1hwj8kv</bpmn:outgoing>
    </bpmn:serviceTask>
    <bpmn:sequenceFlow id="Flow_021z3si" sourceRef="StartEvent_1" targetRef="Activity_1fru9kc">
    </bpmn:sequenceFlow>
    <bpmn:userTask id="Activity_0ozmm5p" name="第二名">
      <bpmn:incoming>Flow_1hwj8kv</bpmn:incoming>
      <bpmn:outgoing>Flow_1tbnntc</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_1hwj8kv" sourceRef="Activity_1fru9kc" targetRef="Activity_0ozmm5p">
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="Flow_1tbnntc" sourceRef="Activity_0ozmm5p" targetRef="Event_03kmy6i">
    </bpmn:sequenceFlow>
    <bpmn:endEvent id="Event_03kmy6i">
      <bpmn:incoming>Flow_1tbnntc</bpmn:incoming>
    </bpmn:endEvent>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNEdge id="Flow_021z3si_di" bpmnElement="Flow_021z3si">
        <di:waypoint x="209" y="120" />
        <di:waypoint x="290" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1hwj8kv_di" bpmnElement="Flow_1hwj8kv">
        <di:waypoint x="390" y="120" />
        <di:waypoint x="480" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1tbnntc_di" bpmnElement="Flow_1tbnntc">
        <di:waypoint x="580" y="120" />
        <di:waypoint x="672" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="173" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1fru9kc_di" bpmnElement="Activity_1fru9kc">
        <dc:Bounds x="290" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0ozmm5p_di" bpmnElement="Activity_0ozmm5p">
        <dc:Bounds x="480" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_03kmy6i_di" bpmnElement="Event_03kmy6i">
        <dc:Bounds x="672" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0lkkmka_di">
        <dc:Bounds x="820" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1t2mucq_di">
        <di:waypoint x="920" y="120" />
        <di:waypoint x="1012" y="120" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
        `,
      previewCanvas: null,
      spaceLength: 10,
    };
  },
  watch: {
    open(newValue, oldValue) {
      if (newValue === true){
        this.$nextTick(() => {
          this.previewTemp();
        })
      }
    },
    // 监视scale控制viewer的缩放
    scale(newValue, oldValue){
      this.$nextTick(() => {
        this.bpmnViewer.get('canvas').zoom('fit-viewport');
      })
    }
  },
  mounted() {
  },
  created() {

  },
  methods: {
    closeDialog() {
      this.$emit('close')
    },

    /**
     * 预览
     */
    previewTemp() {
      this.bpmnViewer && this.bpmnViewer.destroy();
      this.scale = 1;
      this.previewCanvas = this.$refs.preview_canvas;
      this.bpmnViewer = new BpmnViewer(
          {
            container: this.previewCanvas
          }
      );
      try {
        // 实现Bpmn预览
        this.generateBpmnView();
        // 注册鼠标悬浮事件
        this.registerHoverEvent();
      } catch (err) {
        console.error(err);
      }
    },

    /**
     * 生成预览
     */
    generateBpmnView(){
      this.bpmnViewer.importXML(this.currentCanvasXml);
      this.bpmnViewer.get('canvas').zoom('fit-viewport');
    },

    /**
     * 注册鼠标悬浮事件
     */
    registerHoverEvent(){
      // 为节点注册鼠标悬浮事件
      const eventBus = this.bpmnViewer.get('eventBus');
      const overlays = this.bpmnViewer.get('overlays');
      eventBus.on('element.hover', (e) => {
        const overlayHtml = document.createElement('div');
        overlayHtml.innerText = '悬浮发生';
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

}
</script>

<style scoped>
.containerBox {
  height: calc(100vh - 220px);
  position: relative;
}
</style>
