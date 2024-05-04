import { getImageDescBySize } from '../src/utils';

describe('utils', () => {
  it('srcset-parse:dribbble', () => {
    const srcset =
      'https://cdn.dribbble.com/userupload/14376485/file/original-e0b9c4ebf93a0510d6244722db8e1cb0.jpg?crop=0x0-1600x1200&resize=320x240&vertical=center 320w, https://cdn.dribbble.com/userupload/14376485/file/original-e0b9c4ebf93a0510d6244722db8e1cb0.jpg?crop=0x0-1600x1200&resize=400x300&vertical=center 400w, https://cdn.dribbble.com/userupload/14376485/file/original-e0b9c4ebf93a0510d6244722db8e1cb0.jpg?crop=0x0-1600x1200&resize=450x338&vertical=center 450w, https://cdn.dribbble.com/userupload/14376485/file/original-e0b9c4ebf93a0510d6244722db8e1cb0.jpg?crop=0x0-1600x1200&resize=640x480&vertical=center 640w, https://cdn.dribbble.com/userupload/14376485/file/original-e0b9c4ebf93a0510d6244722db8e1cb0.jpg?crop=0x0-1600x1200&resize=700x525&vertical=center 700w, https://cdn.dribbble.com/userupload/14376485/file/original-e0b9c4ebf93a0510d6244722db8e1cb0.jpg?crop=0x0-1600x1200&resize=800x600&vertical=center 800w, https://cdn.dribbble.com/userupload/14376485/file/original-e0b9c4ebf93a0510d6244722db8e1cb0.jpg?crop=0x0-1600x1200&resize=840x630&vertical=center 840w, https://cdn.dribbble.com/userupload/14376485/file/original-e0b9c4ebf93a0510d6244722db8e1cb0.jpg?crop=0x0-1600x1200&resize=1000x750&vertical=center 1000w, https://cdn.dribbble.com/userupload/14376485/file/original-e0b9c4ebf93a0510d6244722db8e1cb0.jpg?crop=0x0-1600x1200&resize=1200x900&vertical=center 1200w';
    console.log(getImageDescBySize(srcset));
  });

  it('srcset-parse:gaoding', () => {
    const srcset =
      'https://gd-filems.dancf.com/193239694/composite-preview/20230907-140850-RCzpk.jpg?x-oss-process=image/resize,w_300,type_6/interlace,1, https://gd-filems.dancf.com/193239694/composite-preview/20230907-140850-RCzpk.jpg?x-oss-process=image/resize,w_600,type_6/interlace,1 2x, https://gd-filems.dancf.com/193239694/composite-preview/20230907-140850-RCzpk.jpg?x-oss-process=image/resize,w_600,type_6/interlace,1 3x';
    console.log(getImageDescBySize(srcset));
  });
});
