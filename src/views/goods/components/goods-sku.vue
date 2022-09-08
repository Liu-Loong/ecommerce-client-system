<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img
            :class="{ selected: val.selected, disabled: val.disabled }"
            @click="changeSku(val, item)"
            v-if="val.picture"
            :src="val.picture"
            :title="val.name"
          />
          <span
            :class="{ selected: val.selected, disabled: val.disabled }"
            @click="changeSku(val, item)"
            v-else
            >{{ val.name }}</span
          >
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import powerSet from "@/vender/power-set";
const spliter = "-";

//得到一个路径字典
const getPathMap = (skus) => {
  //1.得到所有的sku集合 props.goods.skus
  //2.从所有的sku中筛选出有效的sku
  //3.根据有效的sku使用power-set算法得到子集
  //4.根据子集往路径字典对象中存储key-value
  const pathMap = {};
  skus.forEach((sku) => {
    if (sku.inventory > 0) {
      //根据算法计算子集
      //可选值数组
      const valueArr = sku.specs.map((val) => val.valueName);
      //获取子集
      const valueArrPowerSet = powerSet(valueArr);
      //遍历子集 向pathMap插入数据
      valueArrPowerSet.forEach((arr) => {
        //根据arr得到字符串的key，
        const key = arr.join(spliter);
        //向pathMap中设置数据
        if (pathMap[key]) {
          pathMap[key].push(sku.id);
        } else {
          pathMap[key] = [sku.id];
        }
      });
    }
    // console.log(pathMap);
  });
  return pathMap;
};

// 得到当前选中规格集合
const getSelectedValues = (specs) => {
  const arr = [];
  specs.forEach((item) => {
    const selectedVal = item.values.find((val) => val.selected);
    arr.push(selectedVal ? selectedVal.name : undefined);
  });
  return arr;
};

//更新按钮禁用状态
const updateDisabledState = (specs, pathMap) => {
  //1.每一个按钮的状态由本身的disabed数据来控制
  specs.forEach((item, i) => {
    const selectedValues = getSelectedValues(specs);
    item.values.forEach((val) => {
      //在路径字典中查找是否有数据，有则点击，没用则禁用
      if (val.name === selectedValues[i]) return false;
      selectedValues[i] = val.name;
      const key = selectedValues.filter((v) => v).join(spliter);
      val.disabled = !pathMap[key];
    });
  });
};

//初始化默认选中
const initDefaultSelected = (goods, skuId) => {
  //1.找出sku的信息
  //2.遍历每一个按钮，按钮的值和sku记录的值相同，为选中
  const sku = goods.skus.find((sku) => sku.id === skuId);
  goods.specs.forEach((item, i) => {
    // item.values.forEach(val => {
    //val.selected = val.name === sku.specs[i].valueName
    //})
    const val = item.values.find((val) => val.name === sku.specs[i].valueName);
    val.selected = true;
  });
};

export default {
  name: "GoodsSku",
  props: {
    goods: {
      type: Object,
      default: () => ({}),
    },
    skuId: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const pathMap = getPathMap(props.goods.skus);
    //根据skuID初始化默认选中
    if (props.skuId) {
      initDefaultSelected(props.goods, props.skuId);
      // console.log(props.goods);
    }
    //组件初始化的时候：更新按钮禁用状态
    updateDisabledState(props.goods.specs, pathMap);
    //1.选中与取消选中，约定每一个按钮都拥有一个组件的选中数据：selected
    const changeSku = (val, item) => {
      if (val.disabled) return false;
      if (val.selected) {
        val.selected = false;
      } else {
        item.values.forEach((valItem) => {
          valItem.selected = false;
        });
        val.selected = true;
      }
      updateDisabledState(props.goods.specs, pathMap);
      //将选择的sku信息交给父组件 {sku,price,oldPrice,,inventory,specsText}
      //1.选择完整的sku组件按钮，将拿到的数据提交父组件 || 2.不是完整的sku组合，提交空对象给父组件
      const selectedValues = getSelectedValues(props.goods.specs).filter((v) => v);
      //完整
      if (selectedValues.length === props.goods.specs.length) {
        const skuIds = pathMap[selectedValues.join(spliter)];
        const sku = props.goods.skus.find((sku) => sku.id === skuIds[0]);
        emit("change", {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          specsText: sku.specs
            .reduce((p, c) => `${p} ${c.name}: ${c.valueName}`, "")
            .trim(),
        });
      } else {
        //不完整
        emit("change", {});
      }
    };
    return { changeSku };
  },
};
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @themeColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
