import { SVGProps } from "react";

export function LoadingIndicator(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="loading-indicator h-full pb-[16px]">
      <svg
        xmlnsXlink="http://www.w3.org/2000/svg"
        width="78"
        height="67"
        fill="white"
        className="fill-axis-orange"
        {...props}
      >
        <path d="M0 61.0144L3.44498 66.9091L35.3684 48.5359V64.1531H42.1818V48.5359L74.1818 66.9091L77.6268 61.0144L45.7033 42.5646L59.0239 34.9091L55.5789 28.9378L42.1818 36.6699L42.2584 0H35.3684V36.6699L22.0478 28.9378L18.6029 34.9091L31.9234 42.5646L0 61.0144Z" />
      </svg>
    </div>
  );
}
