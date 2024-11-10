export const randomString = (length: number) => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const underscore = '_';

  // 确保每种字符至少出现一次
  const result = [
    uppercase[Math.floor(Math.random() * uppercase.length)],
    lowercase[Math.floor(Math.random() * lowercase.length)],
    digits[Math.floor(Math.random() * digits.length)],
    underscore,
  ];

  // 合并所有字符集
  const allCharacters = uppercase + lowercase + digits + underscore;

  // 填充剩余长度
  for (let i = result.length; i < length; i++) {
    result.push(allCharacters[Math.floor(Math.random() * allCharacters.length)]);
  }

  // 打乱字符顺序
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result.join('');
};
