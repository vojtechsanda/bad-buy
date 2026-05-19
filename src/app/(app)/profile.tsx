import { useAuth } from '@features/auth/hooks';
import { authService } from '@features/auth/service';
import { ScreenContainer } from '@shared/components';
import { Button, ButtonIcon, ButtonText } from '@shared/components/ui/button';
import { LogOut } from 'lucide-react-native';
import { Text, View } from 'react-native';

export default function Profile() {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await authService.signOut();
    } catch {
      console.error('Error logging out');
    }
  };

  return (
    <ScreenContainer withSafeAreaTop={false}>
      <View className="flex-1 px-4 py-6">
        <Text className="mb-6 font-nunito-bold text-heading text-typography-900">Profile</Text>

        <View className="mt-auto items-center">
          {user?.email && (
            <Text className="mb-4 text-center font-nunito text-body text-typography-500">
              Logged in as {user.email}
            </Text>
          )}
          <Button variant="outline" action="secondary" size="sm" onPress={handleLogout}>
            <ButtonIcon as={LogOut} />
            <ButtonText>Log Out</ButtonText>
          </Button>
        </View>
      </View>
    </ScreenContainer>
  );
}
