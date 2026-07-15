const HEX_COLOR_PATTERN = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;

export const isCaptionColorDark = (color: string) => {
  const channels = color.match(HEX_COLOR_PATTERN);
  if (!channels) return false;

  const [red, green, blue] = channels.slice(1).map((channel) => Number.parseInt(channel, 16));
  const perceivedBrightness = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;

  return perceivedBrightness < 0.5;
};
