/**
 * @module ol/style/RegularShape
 */

import {asArray} from '../color.js';
import {asColorLike} from '../colorlike.js';
import {createCanvasContext2D} from '../dom.js';
import ImageState from '../ImageState.js';
import {
  defaultStrokeStyle,
  defaultFillStyle,
  defaultLineCap,
  defaultLineWidth,
  defaultLineJoin,
  defaultMiterLimit
} from '../render/canvas.js';
import ImageStyle from './Image.js';


/**
 * Specify radius for regular polygons, or radius1 and radius2 for stars.
 * @typedef {Object} Options
 * @property {import("./Fill.js").default} [fill] Fill style.
 * @property {number} points Number of points for stars and regular polygons. In case of a polygon, the number of points
 * is the number of sides.
 * @property {Array<number>} [radiuses] Radiuses of a regular polygon.
 * @property {Array<number>} [angleRatios] Radius ratios
 * @property {number} [radius] Radius of a regular polygon. Ignored if `radiuses` is given.
 * @property {number} [radius1] Outer radius of a star. Ignored if `radiuses` is given.
 * @property {number} [radius2] Inner radius of a star. Ignored if `radiuses` is given.
 * @property {number} [angle=0] Shape's angle in radians. A value of 0 will have one of the shape's point facing up.
 * @property {Array<number>} [displacement=[0,0]] Displacement of the shape
 * @property {import("./Stroke.js").default} [stroke] Stroke style.
 * @property {number} [rotation=0] Rotation in radians (positive rotation clockwise).
 * @property {boolean} [rotateWithView=false] Whether to rotate the shape with the view.
 */


/**
 * @typedef {Object} RenderOptions
 * @property {import("../colorlike.js").ColorLike} [strokeStyle]
 * @property {number} strokeWidth
 * @property {number} size
 * @property {CanvasLineCap} lineCap
 * @property {Array<number>} lineDash
 * @property {number} lineDashOffset
 * @property {CanvasLineJoin} lineJoin
 * @property {number} miterLimit
 */


/**
 * @classdesc
 * Set regular shape style for vector features. The resulting shape will be
 * a regular polygon when `radius` is provided, or a star when `radius1` and
 * `radius2` are provided.
 * @api
 */
class RegularShape extends ImageStyle {
  /**
   * @param {Options} options Options.
   */
  constructor(options) {
    /**
     * @type {boolean}
     */
    const rotateWithView = options.rotateWithView !== undefined ?
      options.rotateWithView : false;

    super({
      opacity: 1,
      rotateWithView: rotateWithView,
      rotation: options.rotation !== undefined ? options.rotation : 0,
      scale: 1,
      displacement: options.displacement !== undefined ? options.displacement : [0, 0]
    });

    /**
     * @protected
     * @type {Array<number>}
     */
    this.angleRatios_ = options.angleRatios;

    /**
     * @private
     * @type {HTMLCanvasElement}
     */
    this.canvas_ = null;

    /**
     * @private
     * @type {HTMLCanvasElement}
     */
    this.hitDetectionCanvas_ = null;

    /**
     * @private
     * @type {import("./Fill.js").default}
     */
    this.fill_ = options.fill !== undefined ? options.fill : null;

    /**
     * @private
     * @type {Array<number>}
     */
    this.origin_ = [0, 0];

    /**
     * @private
     * @type {number}
     */
    this.points_ = options.points;

    /**
     * @protected
     * @type {Array<number>}
     */
    this.radiuses_ = options.radiuses !== undefined ? options.radiuses : (function() {
      const radiuses = [options.radius1 !== undefined ? options.radius1 : options.radius];
      if (options.radius2 !== undefined) {
        radiuses.push(options.radius2);
      }
      return radiuses;
    })();

    /**
     * @private
     * @type {number}
     */
    this.angle_ = options.angle !== undefined ? options.angle : 0;

    /**
     * @private
     * @type {import("./Stroke.js").default}
     */
    this.stroke_ = options.stroke !== undefined ? options.stroke : null;

    /**
     * @private
     * @type {Array<number>}
     */
    this.anchor_ = null;

    /**
     * @private
     * @type {import("../size.js").Size}
     */
    this.size_ = null;

    /**
     * @private
     * @type {import("../size.js").Size}
     */
    this.imageSize_ = null;

    /**
     * @private
     * @type {import("../size.js").Size}
     */
    this.hitDetectionImageSize_ = null;

    this.render();

  }

  /**
   * Clones the style.
   * @return {RegularShape} The cloned style.
   * @api
   */
  clone() {
    const style = new RegularShape({
      fill: this.getFill() ? this.getFill().clone() : undefined,
      points: this.getPoints(),
      radiuses: this.getRadiuses().slice(),
      angleRatios: this.getAngleRatios() ? this.getAngleRatios().slice() : undefined,
      angle: this.getAngle(),
      stroke: this.getStroke() ? this.getStroke().clone() : undefined,
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView(),
      displacement: this.getDisplacement().slice()
    });
    style.setOpacity(this.getOpacity());
    style.setScale(this.getScale());
    return style;
  }

  /**
   * @inheritDoc
   * @api
   */
  getAnchor() {
    return this.anchor_;
  }

  /**
   * Get the angle used in generating the shape.
   * @return {number} Shape's rotation in radians.
   * @api
   */
  getAngle() {
    return this.angle_;
  }

  /**
   * Get the fill style for the shape.
   * @return {import("./Fill.js").default} Fill style.
   * @api
   */
  getFill() {
    return this.fill_;
  }

  /**
   * @inheritDoc
   */
  getHitDetectionImage(pixelRatio) {
    return this.hitDetectionCanvas_;
  }

  /**
   * @inheritDoc
   * @api
   */
  getImage(pixelRatio) {
    return this.canvas_;
  }

  /**
   * @inheritDoc
   */
  getImageSize() {
    return this.imageSize_;
  }

  /**
   * @inheritDoc
   */
  getHitDetectionImageSize() {
    return this.hitDetectionImageSize_;
  }

  /**
   * @inheritDoc
   */
  getImageState() {
    return ImageState.LOADED;
  }

  /**
   * @inheritDoc
   * @api
   */
  getOrigin() {
    return this.origin_;
  }

  /**
   * Get the number of points for generating the shape.
   * @return {number} Number of points for stars and regular polygons.
   * @api
   */
  getPoints() {
    return this.points_;
  }

  /**
   * Get the (primary) radius for the shape.
   * @return {number} Radius.
   * @api
   */
  getRadius() {
    return this.radiuses_[0];
  }

  /**
   * Get the secondary radius for the shape.
   * @return {number|undefined} Radius2.
   * @api
   */
  getRadius2() {
    return this.radiuses_.length > 1 ? this.radiuses_[1] : undefined;
  }

  /**
   * Get array of radiuses
   * @return {Array<number>} Radiuses.
   * @api
   */
  getRadiuses() {
    return this.radiuses_;
  }

  /**
   * Get array of angle ratios
   * @return {Array<number>} Angle ratios.
   * @api
   */
  getAngleRatios() {
    return this.angleRatios_;
  }

  /**
   * @inheritDoc
   * @api
   */
  getSize() {
    return this.size_;
  }

  /**
   * Get the stroke style for the shape.
   * @return {import("./Stroke.js").default} Stroke style.
   * @api
   */
  getStroke() {
    return this.stroke_;
  }

  /**
   * @inheritDoc
   */
  listenImageChange(listener) {}

  /**
   * @inheritDoc
   */
  load() {}

  /**
   * @inheritDoc
   */
  unlistenImageChange(listener) {}

  /**
   * @protected
   */
  render() {
    let lineCap = defaultLineCap;
    let lineJoin = defaultLineJoin;
    let miterLimit = 0;
    let lineDash = null;
    let lineDashOffset = 0;
    let strokeStyle;
    let strokeWidth = 0;

    if (this.stroke_) {
      strokeStyle = this.stroke_.getColor();
      if (strokeStyle === null) {
        strokeStyle = defaultStrokeStyle;
      }
      strokeStyle = asColorLike(strokeStyle);
      strokeWidth = this.stroke_.getWidth();
      if (strokeWidth === undefined) {
        strokeWidth = defaultLineWidth;
      }
      lineDash = this.stroke_.getLineDash();
      lineDashOffset = this.stroke_.getLineDashOffset();
      lineJoin = this.stroke_.getLineJoin();
      if (lineJoin === undefined) {
        lineJoin = defaultLineJoin;
      }
      lineCap = this.stroke_.getLineCap();
      if (lineCap === undefined) {
        lineCap = defaultLineCap;
      }
      miterLimit = this.stroke_.getMiterLimit();
      if (miterLimit === undefined) {
        miterLimit = defaultMiterLimit;
      }
    }

    let size = 2 * (Math.max(...this.radiuses_) + strokeWidth) + 1;

    const renderOptions = {
      strokeStyle: strokeStyle,
      strokeWidth: strokeWidth,
      size: size,
      lineCap: lineCap,
      lineDash: lineDash,
      lineDashOffset: lineDashOffset,
      lineJoin: lineJoin,
      miterLimit: miterLimit
    };

    const context = createCanvasContext2D(size, size);
    this.canvas_ = context.canvas;

    // canvas.width and height are rounded to the closest integer
    size = this.canvas_.width;
    const imageSize = size;
    const displacement = this.getDisplacement();

    this.draw_(renderOptions, context, 0, 0);

    this.createHitDetectionCanvas_(renderOptions);

    this.anchor_ = [size / 2 - displacement[0], size / 2 + displacement[1]];
    this.size_ = [size, size];
    this.imageSize_ = [imageSize, imageSize];
  }

  /**
   * @private
   * @param {RenderOptions} renderOptions Render options.
   * @param {CanvasRenderingContext2D} context The rendering context.
   */
  drawShape_(renderOptions, context) {
    if (this.points_ === Infinity) {
      context.arc(
        renderOptions.size / 2, renderOptions.size / 2,
        this.radiuses_[0], 0, 2 * Math.PI, true);
    } else {
      const radiuses = this.radiuses_.length;
      const baseAngle = this.angle_;
      const segments = this.points_;
      const angleUnit = 2 * Math.PI / segments;
      for (let i = 0; i < this.points_; i++) {
        const angle0 = i * angleUnit - Math.PI / 2 + baseAngle;
        for (let j = 0; j < radiuses; j++) {
          const index = j % radiuses;
          const radiusC = this.radiuses_[index];
          let angle = angle0;
          if (this.angleRatios_ !== undefined) {
            angle += angleUnit * this.angleRatios_[j];
          } else {
            angle += angleUnit * j / radiuses;
          }
          context.lineTo(renderOptions.size / 2 + radiusC * Math.cos(angle),
            renderOptions.size / 2 + radiusC * Math.sin(angle));
        }
      }
      context.closePath();
    }
  }

  /**
   * @private
   * @param {RenderOptions} renderOptions Render options.
   * @param {CanvasRenderingContext2D} context The rendering context.
   * @param {number} x The origin for the symbol (x).
   * @param {number} y The origin for the symbol (y).
   */
  draw_(renderOptions, context, x, y) {
    // reset transform
    context.setTransform(1, 0, 0, 1, 0, 0);

    // then move to (x, y)
    context.translate(x, y);

    context.beginPath();

    this.drawShape_(renderOptions, context);

    if (this.fill_) {
      let color = this.fill_.getColor();
      if (color === null) {
        color = defaultFillStyle;
      }
      context.fillStyle = asColorLike(color);
      context.fill();
    }
    if (this.stroke_) {
      context.strokeStyle = renderOptions.strokeStyle;
      context.lineWidth = renderOptions.strokeWidth;
      if (context.setLineDash && renderOptions.lineDash) {
        context.setLineDash(renderOptions.lineDash);
        context.lineDashOffset = renderOptions.lineDashOffset;
      }
      context.lineCap = renderOptions.lineCap;
      context.lineJoin = renderOptions.lineJoin;
      context.miterLimit = renderOptions.miterLimit;
      context.stroke();
    }
    context.closePath();
  }

  /**
   * @private
   * @param {RenderOptions} renderOptions Render options.
   */
  createHitDetectionCanvas_(renderOptions) {
    this.hitDetectionImageSize_ = [renderOptions.size, renderOptions.size];
    this.hitDetectionCanvas_ = this.canvas_;
    if (this.fill_) {
      let color = this.fill_.getColor();

      // determine if fill is transparent (or pattern or gradient)
      let opacity = 0;
      if (typeof color === 'string') {
        color = asArray(color);
      }
      if (color === null) {
        opacity = 1;
      } else if (Array.isArray(color)) {
        opacity = color.length === 4 ? color[3] : 1;
      }
      if (opacity === 0) {

        // if a transparent fill style is set, create an extra hit-detection image
        // with a default fill style
        const context = createCanvasContext2D(renderOptions.size, renderOptions.size);
        this.hitDetectionCanvas_ = context.canvas;

        this.drawHitDetectionCanvas_(renderOptions, context, 0, 0);
      }
    }

  }

  /**
   * @private
   * @param {RenderOptions} renderOptions Render options.
   * @param {CanvasRenderingContext2D} context The context.
   * @param {number} x The origin for the symbol (x).
   * @param {number} y The origin for the symbol (y).
   */
  drawHitDetectionCanvas_(renderOptions, context, x, y) {
    // reset transform
    context.setTransform(1, 0, 0, 1, 0, 0);

    // then move to (x, y)
    context.translate(x, y);

    context.beginPath();

    this.drawShape_(renderOptions, context);

    context.fillStyle = defaultFillStyle;
    context.fill();
    if (this.stroke_) {
      context.strokeStyle = renderOptions.strokeStyle;
      context.lineWidth = renderOptions.strokeWidth;
      if (renderOptions.lineDash) {
        context.setLineDash(renderOptions.lineDash);
        context.lineDashOffset = renderOptions.lineDashOffset;
      }
      context.stroke();
    }
    context.closePath();
  }

}


export default RegularShape;
