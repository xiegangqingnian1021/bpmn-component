//import Palette from "bpmn-js/lib/features/palette/index.js";

export default class CustomPalette {
    constructor(create, elementFactory, palette) {
        this.create = create;
        this.elementFactory = elementFactory;
        palette.registerProvider(this);
    }

    // 这个是绘制palette的核心，函数名不要变
    getPaletteEntries() {
        const elementFactory = this.elementFactory;
        const create = this.create;

        function dragEventFactory(type, label) {
            return function (event) {
                const taskShape = elementFactory.create('shape', {
                    type: type,
                    id: label + "_" + Date.now() + "",
                });
                create.start(event, taskShape);
            };
        }

        return {
            'create.ghost': {
                title: '我是自定义节点-幽灵',    // 鼠标悬浮到节点上显示的文字
                className: 'icon-custom bpmn-icon-ghost',   // 样式名
                action: {      // 操作该节点时会触发的事件，此时只注册一个拖动事件即可，否则拖动时没有效果
                    dragstart: dragEventFactory('bpmn:Task','ghost')
                }
            },
            'create.user': {
                title: '我是自定义节点-用户',
                className: 'icon-custom bpmn-icon-user1',
                action: {
                    dragstart: dragEventFactory('bpmn:Task', 'user')
                }
            },
            'create.chaxiao': {
                title: '我是自定义节点-插销',
                className: 'icon-custom bpmn-icon-chaxiao',
                action: {
                    dragstart: dragEventFactory('bpmn:Task', 'chaxiao')
                }
            },
            'create.chilun': {
                title: '我是自定义节点-齿轮',
                className: 'icon-custom bpmn-icon-chilun',
                action: {
                    dragstart: dragEventFactory('bpmn:Task', 'chilun')
                }
            },
            'create.jiekou': {
                title: '我是自定义节点-接口',
                className: 'icon-custom bpmn-icon-jiekou',
                action: {
                    dragstart: dragEventFactory('bpmn:Task', 'jiekou')
                }
            },
            'create.shuilongtou': {
                title: '我是自定义节点-水龙头',
                className: 'icon-custom bpmn-icon-shuilongtou',
                action: {
                    dragstart: dragEventFactory('bpmn:Task', 'shuilongtou')
                }
            },
            'create.industry_data': {
                title: '我是自定义节点-工业数据',
                className: 'icon-custom bpmn-icon-industry_data',
                action: {
                    dragstart: dragEventFactory('bpmn:Task', 'industry_data')
                }
            },
            'create.cloud_database': {
                title: '我是自定义节点-云数据库',
                className: 'icon-custom bpmn-icon-cloud_database',
                action: {
                    dragstart: dragEventFactory('bpmn:Task', 'cloud_database')
                }
            },
            'create.pc': {
                title: '我是自定义节点-pc',
                className: 'icon-custom bpmn-icon-pc',
                action: {
                    dragstart: dragEventFactory('bpmn:Task', 'pc')
                }
            }
        };
    }
}
CustomPalette.$inject = [
    'create',
    'elementFactory',
    'palette'
];
