Summary: pflege-ausgleich.de landing page
Name: pflege-ausgleich.de
Version: 1.0
Release: %(date +"%Y%m%d%H%M")
Source0: %{name}-%{version}.tar.gz
Group: Application/Web
License: MIT
BuildArch: noarch
Requires(pre): /usr/sbin/useradd, /usr/sbin/groupadd, /usr/bin/getent
Requires(postun): /usr/sbin/userdel

%define user fitbase
%define destination /srv/%{name}-%{release}
%define enterpoint /srv/%{name}
%define home /home/%{user}

%description
pflege-ausgleich.de landing page

%prep
%setup -q

%pre
getent group %{user} > /dev/null || groupadd -r %{user}
getent passwd %{user} > /dev/null || useradd -d %{home} -r -g %{user} %{user}

%install
install -d $RPM_BUILD_ROOT%{destination}
install -d $RPM_BUILD_ROOT%{destination}

# Deploy the project source folders
cp -R ./dist/* $RPM_BUILD_ROOT%{destination}

find $RPM_BUILD_ROOT%{destination} -name '.git*' -exec rm -rf {} +
find $RPM_BUILD_ROOT%{destination} -name '*.dist' -exec rm -f {} +
find $RPM_BUILD_ROOT%{destination} -name '*.zip' -exec rm -f {} +
find $RPM_BUILD_ROOT%{destination} -name '*.tar.*' -exec rm -f {} +
find $RPM_BUILD_ROOT%{destination} -name 'composer.*' -exec rm -f {} +
find $RPM_BUILD_ROOT%{destination} -name '*.spec' -exec rm -f {} +
find $RPM_BUILD_ROOT%{destination} -name '*.message' -exec rm -f {} +
find $RPM_BUILD_ROOT%{destination} -name '*.phar' -exec rm -f {} +
find $RPM_BUILD_ROOT%{destination} -name '*.bak' -exec rm -f {} +
find $RPM_BUILD_ROOT%{destination} -name 'Makefile' -exec rm -f {} +
find $RPM_BUILD_ROOT%{destination} -name 'phpunit.xml' -exec rm -f {} +
find $RPM_BUILD_ROOT%{destination} -name 'phpunit.xml.dist' -exec rm -f {} +
find $RPM_BUILD_ROOT%{destination} -name '.htaccess' -exec rm -f {} +


%post 

# Mark the current application root pointer as a backup 
ls -lh %{enterpoint} && mv %{enterpoint} %{destination}.bak

# Create an new pointer that leads to the new version
# of the application, actually the version we are trying to install
ln -s %{destination} %{enterpoint}

chown -R %{user}:%{user} %{destination}
chown -R %{user}:%{user} %{enterpoint}

%clean
rm -rf $RPM_BUILD_ROOT

%files 
%defattr(644,%{user},%{user},775)
%dir %{destination}

%{destination}/*
