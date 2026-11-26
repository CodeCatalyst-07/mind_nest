/**
 * src/components/AppText.js
 * Purpose: Custom Text component that applies Nunito font variants and theme text colors.
 * Supports variants: 'title', 'heading', 'body', 'caption'.
 */

import React from 'react';
import { Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function AppText({
  children,
  variant = 'body',
  color,
  style,
  ...props
}) {
  const { colors, typography } = useTheme();

  // Pick typography style based on variant (fallback to body)
  const variantStyle = typography[variant] || typography.body;

  // Pick text color: custom color prop > mutedText for caption > default theme text
  const textColor = color || (variant === 'caption' ? colors.mutedText : colors.text);

  return (
    <Text
      style={[variantStyle, { color: textColor }, style]}
      {...props}
    >
      {children}
    </Text>
  );
}
