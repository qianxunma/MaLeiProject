// 面试笔试题
import ProTable from '@ant-design/pro-table';
import React, { useEffect, useState } from 'react';

const data = [
  {
    name: '小明',
    zh: 89,
    math: 78,
    en: 92
  },
  {
    name: '小红',
    zh: 99,
    math: 88,
    en: 95
  },
  {
    name: '小刚',
    zh: 91,
    math: 92,
    en: 93
  },
]

/** Begin: Utils(正常应单独文件存放公用函数) **/
// 四舍五入(避免toFixed银行家算法)
const formatFloat = (num: number, digit: number = 2) => {
  const tmp = parseFloat(num.toString());
  // eslint-disable-next-line no-restricted-properties
  return (Math.round((tmp + Number.EPSILON) * Math.pow(10, digit)) / Math.pow(10, digit)).toFixed(
    digit,
  );
};

// 生成唯一键
const generateTempEditId = () => {
  return +(Math.random() * 1000000000).toFixed(0);
};
/** End: Utils **/

interface TableDataType {
  name: string;
  zh: number;
  math: number;
  en: number;
  key: number;
}

const StudentAgeTable = () => {
  const [dataSource, setDataSource] = useState<TableDataType[]>([]);

  // 计算平均分
  const calcAverageScore = (dataList: TableDataType[]) => {
    // 计算全班所有人的总分数
    const allScore = dataList?.reduce?.((sum: number, currentStudent: TableDataType) => {
      const {
        zh = 0,
        math = 0,
        en = 0
      } = currentStudent;

      return sum + zh + math + en;
    }, 0);
    // 计算平均分
    const averageScore = allScore / dataList.length;
    // 返回四舍五入后的结果，避免精度问题
    return formatFloat(averageScore, 2);
  };

  // 跳蚤跳方格
  const jumpNum = (
    n: number,  // 方格的数量
    status: 0 | 1 | 2 | 3, // 上一次跳跃的格数，默认传0
  ): number => {
    // 当n小于等于0时返回0
    if (n <= 0) {
      return 0;
    }
    // 当n等于1时只能跳一步返回1
    if (n === 1) {
      return 1;
    }
    // 当n等于2时可以跳[1,1]，[2]故返回2
    if (n === 2) {
      return 2;
    }
    // 当n等于3时需判断上一步是否跳的是3格子
    if (n === 3) {
      // 上一步跳的是3时只能这次跳不能跳3所以返回3种跳法
      if (status === 3) {
        return 3;
      }
      // 上一步跳的不是3所以会有4种跳法
      return 4;
    }
    // 当n大于3时递归计算跳法数量
    if (n > 3) {
      // 当上一次跳的是3步时这次只能跳1格或两格
      if (status === 3) {
        return  jumpNum(n - 1, 1) + jumpNum(n - 2, 2);
      }
      // 当上一次跳的非3步时这次可以有3种跳法
      return  jumpNum(n - 1, 1) + jumpNum(n - 2, 2) + jumpNum(n - 3, 3);
    }
    return 0
  };

  // 判断是否是回文字符串
  const isPalindrome  =  (s:  string): boolean =>  {
    // 使用正则替换掉所有非字母和数字并转换为小写字母
    s = s.replace(/[^a-zA-Z0-9]/g,"").replace(/\s/g,"").toLowerCase();
    // 颠倒顺序对比是否相同
    return s === [...s].reverse().join("");
  };

  useEffect(() => {
    console.log('跳蚤跳方格', jumpNum(6, 0));
    console.log('判断是否是回文字符串', isPalindrome('ABC*@#}1221cba'));
    // 表格数据添加唯一键
    const tableData = data?.map?.((item) => {
      return {
        ...item,
        key: generateTempEditId()
      }
    }) || [];
    setDataSource(tableData)
  }, []);

  const columns = [
    {
      dataIndex: 'name',
      title: '姓名',
    },
    {
      dataIndex: 'zh',
      title: '语文成绩',
    },
    {
      dataIndex: 'math',
      title: '数学成绩',
    },
    {
      dataIndex: 'en',
      title: '英语成绩',
    },
  ];

  return (
    <div>
      <div>
        <ProTable
          rowKey={'key'}
          dataSource={dataSource}
          scroll={{ x: 'max-content' }}
          pagination={false}
          toolBarRender={false}
          search={false}
          columns={columns}
        />
      </div>
      <p>平均分：{calcAverageScore(dataSource)}</p>
    </div>
  );
};

export default StudentAgeTable;
