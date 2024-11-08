import ghost from './resources/icon/ghost.png';
import user from './resources/icon/user.png';
import chaxiao from './resources/icon/chaxiao.png'
import chilun from './resources/icon/chilun.png'
import jiekou from './resources/icon/jiekou.png'
import shuilongtou from './resources/icon/shuilongtou.png'
import industry_data from './resources/icon/industry_data.png'
import cloud_database from './resources/icon/cloud_database.png'
import pc from './resources/icon/pc.png'

// 自定义元素的类型，此时我们只需要自定义一种节点，所以数组只有一个元素
const customElements = [
    'bpmn:Task',
    'bpmn:Task',
    'bpmn:Task',
    'bpmn:Task',
    'bpmn:Task',
    'bpmn:Task',
    'bpmn:Task',
    'bpmn:Task',

];
const customConfig = {
    // 自定义元素的配置
    ghost: {
        url: ghost,
        attr: {x: 0, y: 0, width: 50, height: 50}
    },
    user: {
        url: user,
        attr: {x: 0, y: 0, width: 50, height: 50}
    },
    chaxiao: {
        url: chaxiao,
        attr: {x: 0, y: 0, width: 50, height: 50}
    },
    chilun: {
        url: chilun,
        attr: {x: 0, y: 0, width: 50, height: 50}
    },
    jiekou: {
        url: jiekou,
        attr: {x: 0, y: 0, width: 50, height: 50}
    },
    shuilongtou: {
        url: shuilongtou,
        attr: {x: 0, y: 0, width: 50, height: 50}
    },
    industry_data: {
        url: industry_data,
        attr: {x: 0, y: 0, width: 50, height: 50}
    },
    cloud_database: {
        url: cloud_database,
        attr: {x: 0, y: 0, width: 50, height: 50}
    },
    pc: {
        url: pc,
        attr: {x: 0, y: 0, width: 50, height: 50}
    }
};

export {customElements, customConfig};
