import { UIMatch, useMatches } from '@remix-run/react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import React from 'react';

type ItemProps = {
  match: UIMatch<any, any>;
  index: number;
  arr: UIMatch<unknown, unknown>[];
};

function Item({ match, index, arr }: ItemProps) {
  const { href, text } = match.handle.breadcrumb(match);
  return (
    <BreadcrumbItem>
      {index !== arr.length - 1 ? (
        <BreadcrumbLink href={href}>{text}</BreadcrumbLink>
      ) : (
        <BreadcrumbPage>{text}</BreadcrumbPage>
      )}
    </BreadcrumbItem>
  );
}

export default function BreadcrumbNav() {
  const matches = useMatches();
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {matches
          .filter((match) => match.handle && (match.handle as any).breadcrumb)
          .map((match, index, arr) => (
            <React.Fragment key={index}>
              <Item match={match} index={index} arr={arr} />
              {index !== arr.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
