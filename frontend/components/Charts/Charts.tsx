import React, { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";

import { Chart } from "./Chart";

export default function Charts(props: any) {
  const [section, setSection] = useState(0);

  const [dataMode, setDataMode] = useState("hr");
  const [timeMode, setTimeMode] = useState("week");

  const [width, setWidth] = useState<number>(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  if (props.charts.length === 0) {
    return null;
  }

  const modeProps = {
    dataMode: dataMode,
    timeMode: timeMode,
    setDataMode: setDataMode,
    setTimeMode: setTimeMode,
  };

  const isMobile: boolean = width <= 768;
  const sections = props.charts.map((c: any) => (
    <Chart
      data={c.data}
      isMobile={isMobile}
      key={c.title}
      title={`${c.title}`}
      {...c.props}
      {...modeProps}
      {...props}
    />
  ));
  const baseStyle = isMobile
    ? { width: "100%", paddingLeft: 0, paddingRight: 0 }
    : null;

  const titles = props.charts.map((c: any) => {
    if (width < 520 && c.shortTitle !== undefined) {
      return c.shortTitle.toUpperCase();
    }
    if (c.tabTitle !== undefined) {
      return c.tabTitle;
    }
    return c.title.toUpperCase();
  });

  const descriptions =
    props.charts[0].description !== undefined
      ? props.charts.map((c: any) => c.description)
      : undefined;

  return <Box>{sections[section]}</Box>;
}
