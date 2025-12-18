export interface BorderBeamProps {
  /**
   * Optional CSS class to apply custom styling
   */
  className?: string;
  /**
   * The size of the animated beam in pixels
   * @default 200
   */
  size?: number;
  /**
   * The duration of the animation in seconds
   * @default 15
   */
  duration?: number;
  /**
   * The width of the border in pixels
   * @default 1.5
   */
  borderWidth?: number;
  /**
   * The anchor point of the beam as a percentage
   * @default 90
   */
  anchor?: number;
  /**
   * The starting color of the gradient
   * @default "#ffaa40"
   */
  colorFrom?: string;
  /**
   * The ending color of the gradient
   * @default "#9c40ff"
   */
  colorTo?: string;
  /**
   * Delay before the animation starts in seconds
   * @default 0
   */
  delay?: number;
}
