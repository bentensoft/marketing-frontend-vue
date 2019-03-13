// 'deprecate' function makes deprecation notes out of entity and timestamps

function deprecate(entity, deprecationDate, removalDate) {
  const pack = (relation, ts) => ts ? `${relation} date: ${new Date(ts * 1000)}.` : ''; // eslint-disable-line
  if (typeof entity === 'function') {
    console.warn([
      `Function ${entity.name} is deprecated.`,
      pack(' Deprecation date', deprecationDate),
      pack(' Estimated removal date', removalDate),
    ].join(''));
  } else {
    console.warn([
      `${entity.constructor.name} is deprecated.`,
      pack(' Deprecation date', deprecationDate),
      pack(' Estimated removal date', removalDate),
    ].join(''));
  }
}

export default { deprecate };

