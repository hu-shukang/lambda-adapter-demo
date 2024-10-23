import { ActionFunction, LoaderFunction } from '@remix-run/node';
import { Link, useActionData, useNavigate, useRouteLoaderData, useSubmit } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { organizationService } from '~/.server/services/organization.service';
import { RequestWrapper } from '~/.server/utils/request.util';
import { Resp } from '~/.server/utils/response.util';
import Title from '~/components/common/title';
import OrganizationDeleteConfirm from '~/components/organization/organization-delete-confirm';
import OrganizationList from '~/components/organization/organization-list';
import { Button } from '~/components/ui/button';
import { OrganizationInfo, OrganizationOne, organizationOneSchema } from '~/models/organization.model';

export const action = RequestWrapper.init(async ({ request, context }) => {
  const { pk } = context.bodyData as OrganizationOne;
  await organizationService.delete(pk);
  return Resp.json(request, { success: true });
})
  .withBodyValid(organizationOneSchema)
  .action();

export default function OrganizationPage() {
  const loaderData = useRouteLoaderData<LoaderFunction>('routes/dashboard.organization');
  const actionData = useActionData<ActionFunction>();
  const [error, setError] = useState<string>();
  const navigate = useNavigate();
  const submit = useSubmit();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<OrganizationInfo>();

  const updateHandler = (pk: string) => {
    console.log(pk);
    navigate(`/dashboard/organization/${pk}/update`);
  };

  const removeHandler = (info: OrganizationInfo) => {
    setDeleteTarget(info);
    setDeleteConfirmOpen(true);
  };

  const deleteAction = (info: OrganizationInfo) => {
    const formData = new FormData();
    formData.append('pk', info.pk);
    submit(formData, { method: 'POST' });
  };

  useEffect(() => {
    if (actionData?.success == true) {
      setDeleteConfirmOpen(false);
    } else {
      setError(actionData?.error);
    }
  }, [actionData]);

  return (
    <div className="container px-4 mx-auto">
      <div className="flex justify-between items-center mb-2">
        <Title text="組織一覧" />
        <div className="space-x-2">
          <Link to="/dashboard/organization/add">
            <Button>新規作成</Button>
          </Link>
        </div>
      </div>
      <OrganizationList data={loaderData?.data || []} updateHandler={updateHandler} removeHandler={removeHandler} />
      {deleteTarget && (
        <OrganizationDeleteConfirm
          open={deleteConfirmOpen}
          setOpen={(val) => {
            setDeleteConfirmOpen(val);
            setError(undefined);
          }}
          data={loaderData?.data || []}
          info={deleteTarget}
          deleteAction={deleteAction}
          error={error}
        />
      )}
    </div>
  );
}
