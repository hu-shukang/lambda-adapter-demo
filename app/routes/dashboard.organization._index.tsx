import { BreadcrumbLink } from '~/components/ui/breadcrumb';

export const handle = {
  breadcrumb: () => <BreadcrumbLink href="/dashboard/organization">organization</BreadcrumbLink>,
};

export default function OrganizationPage() {
  return <div>organiation index page</div>;
}
