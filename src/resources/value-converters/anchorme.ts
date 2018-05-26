import linkifyHtml from 'linkifyjs/html';

function trim(original: string, preserveFront: number, preserveEnd: number) {
  preserveFront = preserveFront || 30;
  preserveEnd = preserveEnd || 7;

  if (preserveFront && preserveEnd && original.length > (preserveFront + preserveEnd)) {
    return original.substr(0, preserveFront) + '...' + original.substr(original.length - preserveEnd);
  }

  return original;
}

export class AnchormeValueConverter {
  toView(value: string, preserveFront: number, preserveEnd: number) {
    const result = linkifyHtml(value, {
      format: function (original, type) {
        if (type === 'url') { return trim(original, preserveFront, preserveEnd); }

        return original;
      }
    });

    return result;
  }
}
