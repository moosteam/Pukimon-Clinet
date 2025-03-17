export const animationSequence = [
    {
      time: 0,
      action: () => {
        setOpeningRotate(0)
        setOpeningScale(1)
        setSecondaryMyCardRotate(-20);
        setSecondaryMyCardPosition(0);
      }
    },
    {
      time: 3200,
      action: () => {
        setSecondaryMyCardRotate(20);
        setSecondaryMyCardPosition(60);
        setOpeningScale(1.6);
      }
    },
    {
      time: 3600,
      action: () => {
        setStartVideo(true);
      }
    },
    {
      time: 5000,
      action: () => {
        setOpeningScale(2.4);
        setCoinTextOpacity(100);
      }
    },
    {
      time: 7000,
      action: () => {
        setOpeningScale(1);
        setCoinTextOpacity(0);
      }
    },
    {
      time: 7500,
      action: () => {
        setStartVideo(false);
      }
    },
    {
      time: 8500,
      action: () => {
        setFinalGroundRotate(12);
      }
    }
  ];