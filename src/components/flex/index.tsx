import React from 'react';
import classnames from 'classnames';
import styles from './index.module.less';
import { useMemo } from 'react';

export type FlexAlign = 'left' | 'center' | 'right' | 'between' | 'around' | 'evenly';
export type FlexValign = 'top' | 'middle' | 'bottom' | 'stretch' | 'baseline';
export type FlexDirection = 'horizontal' | 'vertical';
export type FlexWrap = 'nowrap' | 'wrap' | 'reverse';
export type FlexScroll = 'x' | 'y' | 'both' | 'hide';

const EAlign = {
  left: styles['fx-a-l'],
  center: styles['fx-a-c'],
  right: styles['fx-a-r'],
  between: styles['fx-a-b'],
  around: styles['fx-a-a'],
  evenly: styles['fx-a-e'],
}

const EValign = {
  top: styles['fx-v-t'],
  middle: styles['fx-v-m'],
  bottom: styles['fx-v-b'],
  stretch: styles['fx-v-s'],
  baseline: styles['fx-v-l'],
}

const EAlignX = {
  left: styles['fx-v-t'],
  center: styles['fx-v-m'],
  right: styles['fx-v-b'],
  between: styles['fx-a-c-b'],
  around: styles['fx-a-c-a'],
  evenly: styles['fx-a-c-e'],
}

const EValignX = {
  top: styles['fx-a-l'],
  middle: styles['fx-a-c'],
  bottom: styles['fx-a-r'],
  stretch: styles['fx-a-b'],
  baseline: styles['fx-a-a'],
}

const EDirection = {
  horizontal: styles['fx-d-h'],
  vertical: styles['fx-d-v'],
}

const EWrap = {
  nowrap: styles['fx-w-n'],
  wrap: styles['fx-w-w'],
  reverse: styles['fx-w-r'],
}

const EScroll = {
  x: styles['fx-s-x'],
  y: styles['fx-s-y'],
  both: styles['fx-s-b'],
  hide: styles['fx-s-h'],
}

const __props = ['align', 'valign', 'direction', 'wrap', 'scroll', 'gap', 'span', 'block', 'full'];

export function Flex(props: React.PropsWithChildren<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  align?: FlexAlign,
  valign?: FlexValign,
  direction?: FlexDirection,
  wrap?: FlexWrap,
  scroll?: FlexScroll,
  gap?: number | [number, number],
  span?: number,
  block?: boolean,
  full?: boolean,
}>) {
  const directionClassName = EDirection[props.direction || 'horizontal'];
  const isVertical = props.direction ? props.direction === 'vertical' : false;
  const alignClassName = isVertical ? EAlignX[props.align || 'left'] : EAlign[props.align || 'left'];
  const valignClassName = isVertical ? EValignX[props.valign || 'top'] : EValign[props.valign || 'top'];
  const wrapClassName = EWrap[props.wrap || 'nowrap'];
  const scrollClassName = EScroll[props.scroll || 'hide'];

  const classes = classnames(
    styles.fx, 
    props.className, 
    directionClassName, 
    alignClassName, 
    valignClassName, 
    wrapClassName, 
    scrollClassName, 
    props.block ? styles['fx-b'] : undefined,
    props.full ? styles['fx-f'] : undefined,
    props.span ? styles['fx-s-' + props.span] : undefined
  );
  
  const gap: [number, number] = props.gap === undefined 
    ? [0, 0] 
    : Array.isArray(props.gap)
      ? props.gap
      : [props.gap, 0];
  
  const _gapStyles: Record<string, any> = props.style || {};
  const _gapsStyles_: Record<string, any> = {};
  for (let i in _gapStyles) {
    _gapsStyles_[i] = _gapStyles[i];
  }
  const gapStyles = Object.assign(_gapsStyles_, {
    rowGap: gap[1],
    columnGap: gap[0],
  })

  const _props = useMemo(() => {
    const _props_: Record<string, any> = {};
    for (const i in props) {
      if (__props.indexOf(i) === -1) {
        _props_[i] = props[i];
      }
    }
    return _props_;
  }, [props]);

  return <div {..._props} className={classes} style={gapStyles}>{props.children}</div>
}
