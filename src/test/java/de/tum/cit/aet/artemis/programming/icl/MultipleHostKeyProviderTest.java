package de.tum.cit.aet.artemis.programming.icl;

import static de.tum.cit.aet.artemis.core.config.Constants.PROFILE_LOCALVC;
import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;

import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.Profile;

import de.tum.cit.aet.artemis.programming.AbstractProgrammingIntegrationLocalCILocalVCTestBase;
import de.tum.cit.aet.artemis.programming.service.localvc.ssh.MultipleHostKeyProvider;

@Profile(PROFILE_LOCALVC)
class MultipleHostKeyProviderTest extends AbstractProgrammingIntegrationLocalCILocalVCTestBase {

    private static final String TEST_PREFIX = "multiplehostkeyprovider";

    @Override
    protected String getTestPrefix() {
        return TEST_PREFIX;
    }

    @Test
    void testMultipleHostKeyProvider() {
        MultipleHostKeyProvider multipleHostKeyProvider = new MultipleHostKeyProvider(Path.of("./"));

        multipleHostKeyProvider.loadKeys(null);
        assertThat(multipleHostKeyProvider.getKeySize()).isEqualTo(0);
    }
}
