import { useMatches } from '@remix-run/react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import React from 'react';

export default function BreadcrumbNav() {
  const matches = useMatches();
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {matches
          .filter((match) => match.handle && (match.handle as any).breadcrumb)
          .map((match, index, arr) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {index !== arr.length - 1 ? (
                  <BreadcrumbLink href={(match.handle as any).breadcrumb.href}>
                    {(match.handle as any).breadcrumb.text}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{(match.handle as any).breadcrumb.text}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index !== arr.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
