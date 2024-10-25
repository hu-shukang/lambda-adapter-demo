export const getFormDataFromObject = (data: Record<string, any>) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      return;
    }
    if (typeof value === 'number') {
      formData.append(key, value.toString());
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, item);
      });
    } else {
      formData.append(key, value);
    }
  });

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
