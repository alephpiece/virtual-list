import * as React from 'react';
import raf from 'rc-util/lib/raf';
import { useCallback, useEffect, useRef } from 'react';

export interface SmoothScrollOptions {
  /**
   * Container element to scroll
   */
  containerRef: React.RefObject<HTMLElement>;
  
  /**
   * Whether smooth scrolling is enabled
   */
  enabled?: boolean;
  
  /**
   * The ratio of the remaining distance to move per animation frame (0~1)
   * Higher values mean faster but less smooth scrolling
   * @default 0.33
   */
  stepRatio?: number;
  
  /**
   * Callback when scroll position changes
   */
  onScrollPositionChange?: (position: number) => void;
}

export interface SmoothScrollResult {
  /**
   * Scroll to target position with animation
   */
  scrollToPosition: (targetPosition: number) => void;
  
  /**
   * Handle wheel delta and scroll with animation
   */
  handleWheelDelta: (delta: number) => void;
  
  /**
   * Stop any ongoing animation
   */
  stopAnimation: () => void;
  
  /**
   * Check if animation is currently running
   */
  isAnimating: () => boolean;
}

/**
 * Hook for handling smooth scrolling animation
 */
export default function useSmoothScroll({
  containerRef,
  enabled = false,
  stepRatio = 0.33,
  onScrollPositionChange,
}: SmoothScrollOptions): SmoothScrollResult {
  // Single ref object to manage all scroll animation states
  const scrollState = useRef({
    isAnimating: false,
    targetPosition: 0,
    animationId: null as number | null,
  });

  // Stop current animation if any
  const stopAnimation = useCallback(() => {
    const { current } = scrollState;
    if (current.animationId) {
      raf.cancel(current.animationId);
      current.animationId = null;
    }
    current.isAnimating = false;
  }, []);

  // Smooth scroll to target position
  const scrollToPosition = useCallback((targetPosition: number) => {
    const { current } = scrollState;
    const container = containerRef.current;

    // If container doesn't exist or smooth scroll is disabled, update directly
    if (!container || !enabled) {
      if (container) {
        container.scrollTop = targetPosition;
        onScrollPositionChange?.(targetPosition);
      }
      return;
    }

    // Update target position
    current.targetPosition = targetPosition;

    // If animation is already running, just update the target
    if (current.isAnimating) {
      return;
    }

    // Start a new animation
    current.isAnimating = true;

    const animateToTarget = () => {
      const currentPosition = container.scrollTop;
      const remainingDistance = current.targetPosition - currentPosition;

      // If remaining distance is small enough, finish the animation
      if (Math.abs(remainingDistance) < 1) {
        container.scrollTop = current.targetPosition;
        onScrollPositionChange?.(current.targetPosition);
        current.isAnimating = false;
        current.animationId = null;
        return;
      }

      // Calculate new position and update scroll
      const newPosition = currentPosition + remainingDistance * stepRatio;
      container.scrollTop = newPosition;
      onScrollPositionChange?.(newPosition);

      // Continue animation
      current.animationId = raf(animateToTarget);
    };

    // Start the animation
    current.animationId = raf(animateToTarget);
  }, [containerRef, enabled, stepRatio, onScrollPositionChange]);

  // Handle wheel delta with smooth scrolling
  const handleWheelDelta = useCallback((delta: number) => {
    if (!containerRef.current || !enabled) return;

    const currentPosition = containerRef.current.scrollTop;
    const targetPosition = currentPosition + delta;
    scrollToPosition(targetPosition);
  }, [containerRef, enabled, scrollToPosition]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, [stopAnimation]);

  return {
    scrollToPosition,
    handleWheelDelta,
    stopAnimation,
    isAnimating: () => scrollState.current.isAnimating,
  };
} 