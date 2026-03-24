"use client";

import dynamic from "next/dynamic";
import { ComponentType } from "react";

type Props = {
  component: () => Promise<{ default: ComponentType<any> }>;
  props?: any;
};

export default function NoSSRWrapper({ component, props }: Props) {
  const DynamicComponent = dynamic(component, {
    ssr: false,
  });

  return <DynamicComponent {...props} />;
}
