export const formDataToObject = (formData: FormData): Record<string, any> => {
  const object: Record<string, any> = {};

  formData.forEach((value, key) => {
    // 检查键中是否包含嵌套路径
    const keys = key.split(/\[|\]+/).filter(Boolean);
    let current = object;

    keys.forEach((subKey, index) => {
      if (index === keys.length - 1) {
        // 设置最后一个子键的值
        current[subKey] = value;
      } else {
        // 如果中间层对象不存在，则初始化为空对象或数组
        current[subKey] = current[subKey] || (isNaN(Number(keys[index + 1])) ? {} : []);
        current = current[subKey];
      }
    });
  });

  return object;
};
