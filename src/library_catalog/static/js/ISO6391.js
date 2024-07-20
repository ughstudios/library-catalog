// Copied with minor modifications from here https://github.com/meikidd/iso-639-1/blob/master/src/index.js

class ISO6391 {
  static getLanguages(codes) {
      return codes.map(code => ({
          code,
          name: ISO6391.getName(code),
          nativeName: ISO6391.getNativeName(code)
      }));
  }

  static getAllNames() {
      return Object.values(LANGUAGES_LIST).map(lang => lang.name);
  }

  static getAllNativeNames() {
      return Object.values(LANGUAGES_LIST).map(lang => lang.nativeName);
  }

  static getName(code) {
      return LANGUAGES_LIST[code] ? LANGUAGES_LIST[code].name : '';
  }

  static getNativeName(code) {
      return LANGUAGES_LIST[code] ? LANGUAGES_LIST[code].nativeName : '';
  }

  static getCode(name) {
      const code = Object.keys(LANGUAGES_LIST).find(
          code => LANGUAGES_LIST[code].name.toLowerCase() === name.toLowerCase()
      );
      return code || '';
  }

  static validate(code) {
      return LANGUAGES_LIST.hasOwnProperty(code);
  }
}

window.ISO6391 = ISO6391;
