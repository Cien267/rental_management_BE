const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" phải là một mongo id hợp lệ');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('mật khẩu phải có ít nhất 8 ký tự');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('mật khẩu phải chứa ít nhất 1 chữ cái và 1 số');
  }
  return value;
};

module.exports = {
  objectId,
  password,
};
