export function AuctionInfoCard(
  props: React.HtmlHTMLAttributes<HTMLDivElement>,
) {
  return (
    <div className={props.className}>
      <h4 className="text-3xl tracking-wide">Auction Info</h4>
      <div className="mt-4 grid grid-cols-2">{props.children}</div>
    </div>
  );
}
