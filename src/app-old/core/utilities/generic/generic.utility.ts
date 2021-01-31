import * as Icons from 'mdue';

const icons = new Map<string, any>([
    ['access-point', Icons.AccessPoint],
    ['account-circle', Icons.AccountCircle],
    ['account-box-multiple', Icons.AccountBoxMultiple],
    ['account-cowboy-hat', Icons.AccountCowboyHat],
    ['account-star', Icons.AccountStar],
    ['account-tie', Icons.AccountTie],
    ['airplane', Icons.Airplane],
    ['alarm-light', Icons.AlarmLight],
    ['alert-circle', Icons.AlertCircle],
    ['alien', Icons.Alien],
    ['ambulance', Icons.Ambulance],
    ['ammunition', Icons.Ammunition],
    ['archive', Icons.Archive],
    ['arm-flex', Icons.ArmFlex],
    ['arrow-right-drop-circle', Icons.ArrowRightDropCircle],
    ['baseball-bat', Icons.BaseballBat],
    ['bed', Icons.Bed],
    ['bomb', Icons.Bomb],
    ['bookmark', Icons.Bookmark],
    ['briefcase', Icons.Briefcase],
    ['broom', Icons.Broom],
    ['bus', Icons.Bus],
    ['cake-variant', Icons.CakeVariant],
    ['cards-heart', Icons.CardsHeart],
    ['cart', Icons.Cart],
    ['cat', Icons.Cat],
    ['chat', Icons.Chat],
    ['check-decagram', Icons.CheckDecagram],
    ['code-braces', Icons.CodeBraces],
    ['coffee', Icons.Coffee],
    ['emoticon', Icons.Emoticon],
    ['face', Icons.Face],
    ['faceWoman', Icons.FaceWoman],
    ['flag-variant', Icons.FlagVariant],
    ['food-drumstick', Icons.FoodDrumstick],
    ['ghost', Icons.Ghost],
    ['home', Icons.Home],
    ['label', Icons.Label],
    ['map-marker', Icons.MapMarker],
    ['microsoft-xbox-controller', Icons.MicrosoftXboxController],
    ['monitor', Icons.Monitor],
    ['movie-open', Icons.MovieOpen],
    ['music', Icons.Music],
    ['nature-people', Icons.NaturePeople],
    ['phone', Icons.Phone],
    ['sofa-single', Icons.SofaSingle],
    ['star', Icons.Star],
    ['thumb-down', Icons.ThumbDown],
    ['thumb-up', Icons.ThumbUp],
    ['web', Icons.Web]
]);

export class GenericUtility {

    public static replaceAt<T>(elements: T[], element: T, index: number): T[] {
        if (index < 0 || index > elements.length - 1) {
            throw new Error('Index out of bounds.');
        }

        return [...elements.slice(0, index), element, ...elements.slice(index + 1)];
    }

    public static getIconNames(): string[] {
        return Array.from(icons).map(_ => _[0]);
    }

    public static getIcon(name: string): any {
        return icons.get(name) ?? null;
    }
}