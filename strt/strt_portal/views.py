# -*- coding: utf-8 -*-
#########################################################################
#
# Copyright 2018, GeoSolutions Sas.
# All rights reserved.
#
# This source code is licensed under the BSD-style license found in the
# LICENSE file in the root directory of this source tree.
#
#########################################################################

import jwt

from django.conf import settings

from django import forms
from django.forms import ValidationError
from django.views.generic.base import TemplateView
from django.contrib.auth import authenticate, login
from django.utils.translation import ugettext_lazy as _

from strt_tests.forms import UserAuthenticationForm
from rules.contrib.views import permission_required

from django_currentuser.middleware import (
    get_current_authenticated_user
)
from django.shortcuts import (
    render, redirect
)
from strt_users.models import Organization


def privateAreaView(request):
    current_user = get_current_authenticated_user()
    if current_user:
        if current_user.has_perm('strt_users.can_access_serapide'):
            return redirect('serapide')
        elif current_user.has_perm('strt_users.can_manage_users'):
            return redirect('users_list')
        else:
            return redirect('')
    else:
        # TODO: redirect to RT SSO service endpoint
        if request.method == "POST":
            form = UserAuthenticationForm(request.POST)
            if form.is_valid():
                form_cleaned_data = form.cleaned_data
                orgs = [
                    {
                        'organization': org
                    }
                    for org
                    in form_cleaned_data['hidden_orgs'].split('-')
                    if org
                ]
                form_cleaned_data.pop('hidden_orgs')
                form_cleaned_data['organizations'] = orgs
                encoded_jwt = jwt.encode(
                    payload=form_cleaned_data,
                    key=settings.SECRET_KEY,
                    algorithm='HS256'
                )

                try:
                    user = authenticate(encoded_jwt)
                    _organization = orgs.pop()['organization'].strip()
                    organization = None
                    try:
                        # Organizations must be already registered
                        organization = Organization._default_manager.get(
                            code=_organization
                        )
                    except Organization.DoesNotExist:
                        ve = forms.ValidationError(
                            _("L'ente {} non risulta censito.".format(_organization))
                        )
                        form.add_error(None, ve)

                    if user and organization:
                        login(request, user)
                        request.session['organization'] = organization.code
                        return redirect('serapide')
                except ValidationError as ve:
                    form.add_error(None, ve)
        else:
            form = UserAuthenticationForm()
    context = {'form': form}
    return render(request, 'strt_tests/user_authentication_test.html', context)


@permission_required('strt_users.can_access_serapide')
def serapideView(request):
    return render(request, 'index.html')  # serapide-client


class GeoportalView(TemplateView):

    template_name = "strt_portal/geoportal/geoportal.html"


class OpendataView(TemplateView):

    template_name = "strt_portal/opendata/opendata.html"


class GlossaryView(TemplateView):

    template_name = "strt_portal/glossary/glossary.html"
