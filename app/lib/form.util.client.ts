/**
 * 将对象转换为 FormData 格式
 * @param data - 要转换的对象
 * @param formData - 递归使用的 FormData 对象（默认初始为空）
 * @param parentKey - 父级 key，用于处理嵌套结构
 */
export const getFormDataFromObject = (
  data: Record<string, any>,
  formData: FormData = new FormData(),
  parentKey: string = '',
): FormData => {
  for (const key in data) {
    if (Object.hasOwn(data, key)) {
      const value = data[key];
      const formKey = parentKey ? `${parentKey}[${key}]` : key;

      if (value === undefined) {
        continue;
      }

      if (Array.isArray(value)) {
        // 处理数组：递归添加每个数组项
        value.forEach((item, index) => {
          getFormDataFromObject(item, formData, `${formKey}[${index}]`);
        });
      } else if (value instanceof Object && !(value instanceof File)) {
        // 处理嵌套对象：递归调用 toFormData
        getFormDataFromObject(value, formData, formKey);
      } else {
        // 处理基本类型（字符串、数字、布尔值）和文件类型
        formData.append(formKey, value);
      }
    }
  }
  return formData;
};

export const getQueryDataFromObject = (data: Record<string, any>) => {
  return Object.entries(data)
    .filter(([_k, v]) => v !== undefined && v !== null && v !== '')
    .reduce((prev, [k, v]) => {
      prev[k] = v;
      return prev;
    }, {} as any);
};
