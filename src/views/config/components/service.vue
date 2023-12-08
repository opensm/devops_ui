<template>
  <div class="createPost-container">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      class="form-container"
      label-position="top"
      label-width="100px"
    >
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 80px;" prop="service_name">
              <MDinput v-model="postForm.service_name" :maxlength="100" name="service_name" required>
                服务名称
              </MDinput>
            </el-form-item>
            {{ postForm }}

            <div class="postInfo-container">
              <el-row>
                <el-col :span="22" style="margin-bottom: 40px;">
                  <el-form-item label="端口是否启用" prop="service_ports_enable">
                    <el-switch
                      v-model="postForm.service_ports_enable"
                      style="display: block"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      active-text="是"
                      inactive-text="否"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="postForm.service_ports_enable">
                <div v-for="(port,index) in postForm.service_ports" :key="index">
                  <el-row type="flex" align="middle">
                    <el-col :span="5" style="margin-right: 20px">
                      <el-form-item
                        :key="port.id"
                        :label="'端口名称：' + index"
                        :prop="'service_ports.' + index + '.name'"
                        :rules="[{ required: true, message: '端口名称不能为空', trigger: 'blur' }, { pattern: /^[^\u4e00-\u9fa5]+$/, message: '不允许输入中文', trigger: 'blur' }, { validator: validateServiceName, message: '只可以输入数字和字母和中横杠', trigger: 'blur' }]"
                      >
                        <el-input v-model="port.name" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="5" style="margin-right: 20px">
                      <el-form-item
                        :key="index"
                        :label="'对外端口：' + index"
                        :prop="'service_ports.' + index + '.port'"
                        :rules="[{required: true, message: '端口不能为空', trigger: 'blur'}]"
                      >
                        <el-input-number v-model="port.port" :min="80" :max="65535" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="5" style="margin-right: 20px">
                      <el-form-item
                        :key="index"
                        :label="'端口协议：' + index"
                        :prop="'service_ports.' + index + '.protocol'"
                        :rules="{required: true, message: '端口类型不能为空', trigger: 'blur'}"
                      >
                        <el-input v-model="port.protocol" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="5" style="margin-right: 20px">
                      <el-form-item
                        :key="index"
                        :label="'源端口(启动端口)：' + index"
                        :prop="'service_ports.' + index + '.source'"
                        :rules="[{required: true, message: '源端口不能为空', trigger: 'blur'}]"
                      >
                        <el-input-number v-model="port.source" :min="80" :max="65535" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">
                      <el-form-item
                        :key="index+'s'"
                        :label="` \u00a0`"
                      >
                        <el-button style="margin-bottom: 0;" type="danger" @click.prevent="removePort(port)">删除</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <el-form-item>
                  <el-button type="success" @click="addPort">新增端口</el-button>
                </el-form-item>
              </el-row>
              <el-divider content-position="center">端口配置</el-divider>
            </div>
            <div class="postInfo-container">
              <el-row>
                <el-col :span="10" style="margin-bottom: 40px;">
                  <el-form-item style="width: 80%" label="代码仓库" prop="service_git">
                    <el-input
                      v-model="postForm.service_git"
                      class="filter-item"
                      size="medium"
                      placeholder="代码仓库"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="10" style="margin-bottom: 40px;">
                  <el-form-item style="width: 50%" label="关联配置" prop="service_config">
                    <el-select
                      v-model="postForm.service_config"
                      clearable
                      multiple
                      multiple-limit="3"
                    >
                      <el-option
                        v-for="(config,index) in configList"
                        :key="index"
                        :value="config.id"
                        :label="config.service_name"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <div style="margin-top: 15px;">
                  <el-form-item label="编译命令" prop="service_compile">

                    <el-select v-model="compile_exe" placeholder="请选择" style="width: 20%">
                      <el-option label="npm版本：6.14.4，node版本：v16.15.1" value="npm-6.14.4-node-v16.15.1">
                        npm版本：6.14.4，node版本：v16.15.1
                      </el-option>
                      <el-option label="npm版本：8.11.0，node版本：v16.15.1" value="npm-8.11.0-node-v16.15.1">
                        npm版本：8.11.0，node版本：v16.15.1
                      </el-option>
                      <el-option label="mvn版本：3.6.3，java版本：1.8.0_202" value="mvn-3.6.3-java-1.8.0_202">
                        mvn版本：3.6.3，java版本：1.8.0_202
                      </el-option>
                      <el-option label="mvn版本：3.8.6，java版本：1.8.0_202" value="mvn-3.8.6-java-1.8.0_202">
                        mvn版本：3.8.6，java版本：1.8.0_202
                      </el-option>
                      <el-option label="mvn版本：3.8.6，openjdk版本：11.0.17.0.8" value="mvn-3.8.6-openjdk-11.0.17.0.8">
                        mvn版本：3.8.6，openjdk版本：11.0.17.0.8
                      </el-option>
                    </el-select>
                    <el-input
                      v-model="postForm.service_compile"
                      style="width: 60%"
                      class="input-with-select"
                      placeholder="代码仓库"
                    />
                  </el-form-item>

                </div>
              </el-row>
              <el-divider content-position="center">代码相关</el-divider>
              <el-row>
                <el-form-item style="width: 80%" label="是否开启环境变量" prop="service_environment_enable">
                  <el-switch
                    v-model="postForm.service_environment_enable"
                    style="display: block"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="是"
                    inactive-text="否"
                  />
                </el-form-item>
              </el-row>
              <el-row v-if="postForm.service_environment_enable">
                <div v-for="(env, index) in postForm.service_environment" :key="index">
                  <el-row>
                    <el-col :span="5" style="margin-right: 10px">
                      <el-form-item
                        :key="index"
                        :label="'环境变量键：' + index"
                        :prop="'service_environment.' + index + '.key'"
                        :rules="[{required: true, message: '环境变量键不能为空', trigger: 'blur'},{ pattern: /^[^\u4e00-\u9fa5]+$/, message: '环境变量键不能为空', trigger: 'blur' },{ validator: checkSpecialKey, message: '只可以输入数字和字母和中横杠', trigger: 'blur' }]"
                      >
                        <el-input v-model="env.key" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="5" style="margin-right: 10px">
                      <el-form-item
                        :key="index"
                        :label="'环境变量值：' + index"
                        :prop="'service_environment.' + index + '.value'"
                        :rules="[{required: true, message: '环境变量值不能为空', trigger: 'blur'}]"
                      >
                        <el-input v-model="env.value" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="5" style="margin-right: 10px">
                      <el-form-item
                        :key="index"
                        :label="'类型：' + index"
                        :prop="'service_environment.' + index + '.type'"
                        :rules="{required: true, message: '端口类型不能为空', trigger: 'blur'}"
                      >
                        <el-select v-model="env.type">
                          <el-option value="key" label="Key(键值对)">Key(键值对)</el-option>
                          <el-option value="secret" label="Secret(密文)">Secret(密文)</el-option>
                          <el-option value="config" label="Config(配置)">Config(配置)</el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">
                      <el-form-item
                        :key="index+'s'"
                        :label="` \u00a0`"
                      >
                        <el-button style="margin-bottom: 0;" type="danger" @click.prevent="removeEnv(env)">删除</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-divider content-position="center">环境变量配置</el-divider>
                </div>
                <el-form-item>
                  <el-button type="success" @click="addEnv()">新增环境变量</el-button>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item style="width: 80%" label="是否开启健康检查" prop="service_healthy_enable">
                  <el-switch
                    v-model="postForm.service_healthy_enable"
                    style="display: block"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="是"
                    inactive-text="否"
                  />
                </el-form-item>
              </el-row>
              <el-row v-if="postForm.service_healthy_enable">
                <el-col :span="2" style="margin-right: 20px">
                  <el-form-item
                    label="就绪检测类型"
                    prop="service_healthy_type"
                    :rules="[{required: true, message: '就绪检测类型不能为空', trigger: 'blur'}]"
                  >
                    <el-select v-model="service_healthy_type">
                      <el-option value="tcp" label="TCP">TCP</el-option>
                      <el-option value="http" label="HTTP">HTTP</el-option>
                      <el-option value="exec" label="EXEC">EXEC</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="3" style="margin-right: 20px">
                  <el-form-item
                    label="端口"
                    prop="service_readiness.port"
                    :rules="[{required: true, message: '端口不能为空', trigger: 'blur'}]"
                  >
                    <el-input-number
                      v-model="postForm.service_readiness.port"
                      class="filter-item"
                      size="medium"
                      placeholder="启动端口"
                      :min="80"
                      :max="65535"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="3" style="margin-right: 20px">
                  <el-form-item
                    label="探测周期（秒）"
                    prop="service_readiness.periodSeconds"
                    :rules="[{required: true, message: '探测周期不能为空', trigger: 'blur'}]"
                  >
                    <el-input-number
                      v-model="postForm.service_readiness.periodSeconds"
                      class="filter-item"
                      size="medium"
                      placeholder="探测周期"
                      :min="2"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="3" style="margin-right: 20px">
                  <el-form-item
                    label="超时（秒）"
                    prop="service_readiness.timeoutSeconds"
                    :rules="[{required: true, message: '超时不能为空', trigger: 'blur'}]"
                  >
                    <el-input-number
                      v-model="postForm.service_readiness.timeoutSeconds"
                      class="filter-item"
                      size="medium"
                      placeholder="超时"
                      :min="1"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="3" style="margin-right: 20px">
                  <el-form-item
                    label="首次检查（秒）"
                    prop="service_readiness.initialDelaySeconds"
                    :rules="[{required: true, message: '首次健康检查的等待时间不能为空', trigger: 'blur'}]"
                  >
                    <el-input-number
                      v-model="postForm.service_readiness.initialDelaySeconds"
                      class="filter-item"
                      size="medium"
                      placeholder="首次健康检查的等待时间"
                      :min="10"
                    />
                  </el-form-item>
                </el-col>
                <div v-if="service_healthy_type === 'http'">
                  <el-col :span="3" style="margin-right: 20px">
                    <el-form-item
                      label="HTTP路径"
                      prop="service_readiness.httpPath"
                      :rules="[{required: true, message: 'HTTP路径不能为空', trigger: 'blur'}]"
                    >
                      <el-input
                        v-model="postForm.service_readiness.httpPath"
                        class="filter-item"
                        size="medium"
                        placeholder="HTTP路径"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="3" style="margin-right: 20px">
                    <el-form-item
                      label="HTTPscheme"
                      prop="service_readiness.Scheme"
                      :rules="[{required: true, message: 'HTTPscheme不能为空', trigger: 'blur'}]"
                    >
                      <el-select v-model="postForm.service_readiness.Scheme">
                        <el-option value="http" label="HTTP">HTTP</el-option>
                        <el-option value="https" label="HTTPS">HTTPS</el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </div>
                <div v-if="service_healthy_type === 'tcp'">
                  <el-col :span="3" style="margin-right: 20px">
                    <el-form-item
                      label="至少成功（次）"
                      prop="service_readiness.successThreshold"
                      :rules="[{required: true, message: '至少成功次数不能为空', trigger: 'blur'}]"
                    >
                      <el-input-number
                        v-model="postForm.service_readiness.successThreshold"
                        class="filter-item"
                        size="medium"
                        placeholder="至少成功次数"
                        :min="1"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="3" style="margin-right: 20px">
                    <el-form-item
                      label="失败尝试（次）"
                      prop="service_readiness.failureThreshold"
                      :rules="[{required: true, message: '失败尝试次数不能为空', trigger: 'blur'}]"
                    >
                      <el-input-number
                        v-model="postForm.service_readiness.failureThreshold"
                        class="filter-item"
                        size="medium"
                        placeholder="失败尝试次数"
                        :min="2"
                      />
                    </el-form-item>
                  </el-col>
                </div>
              </el-row>
              <el-row v-if="postForm.service_healthy_enable">
                <el-col :span="2" style="margin-right: 20px">
                  <el-form-item
                    label="存活检测类型"
                    prop="service_readiness"
                    :rules="[{required: true, message: '就绪检测类型不能为空', trigger: 'blur'}]"
                  >
                    <el-select v-model="service_healthy_type2">
                      <el-option value="tcp" label="TCP">TCP</el-option>
                      <el-option value="http" label="HTTP">HTTP</el-option>
                      <el-option value="exec" label="EXEC">EXEC</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="3" style="margin-right: 20px">
                  <el-form-item
                    label="端口"
                    prop="service_liveness.port"
                    :rules="[{required: true, message: '端口不能为空', trigger: 'blur'}]"
                  >
                    <el-input-number
                      v-model="postForm.service_liveness.port"
                      class="filter-item"
                      size="medium"
                      placeholder="启动端口"
                      :min="80"
                      :max="65535"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="3" style="margin-right: 20px">
                  <el-form-item
                    label="探测周期（秒）"
                    prop="service_liveness.periodSeconds"
                    :rules="[{required: true, message: '探测周期不能为空', trigger: 'blur'}]"
                  >
                    <el-input-number
                      v-model="postForm.service_liveness.periodSeconds"
                      class="filter-item"
                      size="medium"
                      placeholder="探测周期"
                      :min="2"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="3" style="margin-right: 20px">
                  <el-form-item
                    label="超时（秒）"
                    prop="service_liveness.timeoutSeconds"
                    :rules="[{required: true, message: '超时不能为空', trigger: 'blur'}]"
                  >
                    <el-input-number
                      v-model="postForm.service_liveness.timeoutSeconds"
                      class="filter-item"
                      size="medium"
                      placeholder="超时"
                      :min="1"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="3" style="margin-right: 20px">
                  <el-form-item
                    label="首次检查（秒）"
                    prop="service_liveness.initialDelaySeconds"
                    :rules="[{required: true, message: '首次健康检查的等待时间不能为空', trigger: 'blur'}]"
                  >
                    <el-input-number
                      v-model="postForm.service_liveness.initialDelaySeconds"
                      class="filter-item"
                      size="medium"
                      placeholder="首次健康检查的等待时间"
                      :min="10"
                    />
                  </el-form-item>
                </el-col>
                <div v-if="service_healthy_type2 === 'http'">
                  <el-col :span="3" style="margin-right: 20px">
                    <el-form-item
                      label="HTTP路径"
                      prop="service_liveness.httpPath"
                      :rules="[{required: true, message: 'HTTP路径不能为空', trigger: 'blur'}]"
                    >
                      <el-input
                        v-model="postForm.service_liveness.httpPath"
                        class="filter-item"
                        size="medium"
                        placeholder="HTTP路径"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="3" style="margin-right: 20px">
                    <el-form-item
                      label="HTTPscheme"
                      prop="service_liveness.Scheme"
                      :rules="[{required: true, message: 'HTTPscheme不能为空', trigger: 'blur'}]"
                    >
                      <el-select v-model="postForm.service_liveness.Scheme">
                        <el-option value="http" label="HTTP">HTTP</el-option>
                        <el-option value="https" label="HTTPS">HTTPS</el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </div>
                <div v-if="service_healthy_type2 === 'tcp'">
                  <el-col :span="3" style="margin-right: 20px">
                    <el-form-item
                      label="至少成功（次）"
                      prop="service_liveness.successThreshold"
                      :rules="[{required: true, message: '至少成功次数不能为空', trigger: 'blur'}]"
                    >
                      <el-input-number
                        v-model="postForm.service_liveness.successThreshold"
                        class="filter-item"
                        size="medium"
                        placeholder="至少成功次数"
                        :min="1"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="3" style="margin-right: 20px">
                    <el-form-item
                      label="失败尝试（次）"
                      prop="service_liveness.failureThreshold"
                      :rules="[{required: true, message: '失败尝试次数不能为空', trigger: 'blur'}]"
                    >
                      <el-input-number
                        v-model="postForm.service_liveness.failureThreshold"
                        class="filter-item"
                        size="medium"
                        placeholder="失败尝试次数"
                        :min="2"
                      />
                    </el-form-item>
                  </el-col>
                </div>
              </el-row>
              <el-row>
                <el-col :span="5" style="margin-right: 20px">
                  <el-form-item
                    label="是否启用监控"
                    prop="service_prometheus_enable"
                    :rules="[{required: true, message: '是否启用监控不能为空', trigger: 'blur'}]"
                  >
                    <el-switch
                      v-model="postForm.service_prometheus_enable"
                      style="display: block"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      active-text="是"
                      inactive-text="否"
                    />
                  </el-form-item>
                </el-col>
                <div v-if="postForm.service_prometheus_enable">
                  <el-col :span="3" style="margin-right: 20px">
                    <el-form-item
                      label="监控端口"
                      prop="service_prometheus.port"
                      :rules="[{required: true, message: '监控端口不能为空', trigger: 'blur'}]"
                    >
                      <el-input-number
                        v-model="postForm.service_prometheus.port"
                        class="filter-item"
                        size="medium"
                        placeholder="监控端口"
                        :min="1"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="5" style="margin-right: 20px">
                    <el-form-item
                      label="监控路径"
                      prop="service_prometheus.path"
                      :rules="[{required: true, message: '监控路径不能为空', trigger: 'blur'}]"
                    >
                      <el-input
                        v-model="postForm.service_prometheus.path"
                        class="filter-item"
                        size="medium"
                        placeholder="监控路径"
                        :min="1"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="5" style="margin-right: 20px">
                    <el-form-item
                      label="监控scrape"
                      prop="service_prometheus.scrape"
                      :rules="[{required: true, message: '监控scrape不能为空', trigger: 'blur'}]"
                    >
                      <el-switch
                        v-model="postForm.service_prometheus.scrape"
                        style="display: block"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                      />
                    </el-form-item>
                  </el-col>
                </div>
              </el-row>
              <el-row>
                <el-col :span="22" style="margin-right: 20px">
                  <el-form-item
                    label="是否启用域名"
                    prop="service_domain_enable"
                    :rules="[{required: true, message: '是否启用域名不能为空', trigger: 'blur'}]"
                  >
                    <el-switch
                      v-model="postForm.service_domain_enable"
                      style="display: block"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      active-text="是"
                      inactive-text="否"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="postForm.service_domain_enable">
                <el-col :span="11" style="margin-right: 20px">
                  <el-form-item
                    label="域名配置信息"
                    prop="service_domain.hosts"
                    :rules="[{required: true, message: '是否启用域名不能为空', trigger: 'blur'}]"
                  >
                    <CodeEditor style="min-height:300px" :showChangemode="false" :editorValue.sync="postForm.service_domain.hosts" />
                  </el-form-item>
                </el-col>
                <el-col :span="11" style="margin-right: 20px">
                  <el-form-item
                    label="域名证书信息"
                    prop="service_domain.hosts"
                    :rules="[{required: true, message: '是否启用域名不能为空', trigger: 'blur'}]"
                  >
                    <el-input
                      v-model="postForm.service_domain.hosts"
                      class="filter-item"
                      size="medium"
                      placeholder="域名配置信息"
                      type="textarea"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="22" style="margin-right: 20px">
                  <el-form-item
                    label="是否启用skywalking"
                    prop="service_skywalking_enable"
                    :rules="[{required: true, message: '是否启用Skywalking不能为空', trigger: 'blur'}]"
                  >
                    <el-switch
                      v-model="postForm.service_skywalking_enable"
                      style="display: block"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      active-text="是"
                      inactive-text="否"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="postForm.service_skywalking_enable">
                <el-col :span="22" style="margin-right: 20px">
                  <el-form-item
                    label="Skywalking镜像"
                    prop="service_skywalking.image"
                    :rules="[{required: true, message: 'Skywalking镜像不能为空', trigger: 'blur'}]"
                  >
                    <el-input
                      v-model="postForm.service_skywalking.image"
                      class="filter-item"
                      size="medium"
                      placeholder="Skywalking镜像"
                      type="textarea"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-divider content-position="center">部署相关</el-divider>
            </div>
          </el-col>
        </el-row>
      </div>
      <sticky :z-index="10" class-name="draft" style="float:right">
        <el-button v-loading="loading" style="margin:10px 40px 0 10px" type="success" @click="submitForm">
          确认
        </el-button>
        <router-link to="/config/service" style="margin:10px 40px 0 10px">
          <el-button v-loading="loading" type="warning">
            取消
          </el-button>
        </router-link>
      </sticky>
    </el-form>
  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import {
  getService,
  createService,
  updateService,
  getServiceConfigList
} from '@/api/service'
import { checkSpecialKey } from '@/utils/validate'
import CodeEditor from '@/components/CodeEditor/index.vue'
const defaultForm = {
  id: undefined,
  service_name: '',
  service_ports_enable: false,
  service_ports: [],
  service_config: [],
  service_git: '',
  service_compile: 'clean package -Dmaven.test.skip=true',
  service_environment_enable: false,
  service_environment: [],
  service_healthy_enable: false,
  service_healthy_type: 'tcp',
  service_readiness: {},
  service_liveness: {},
  service_prometheus_enable: false,
  service_prometheus: { port: 8080, path: '/', scrape: true },
  service_domain_enable: false,
  service_domain: {},
  service_skywalking_enable: false,
  service_skywalking: {}
}

export default {
  name: 'DetailPage',
  components: { MDinput, Sticky, CodeEditor },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateServiceName = (rule, value, callback) => {
      if (!checkSpecialKey(value)) {
        callback(new Error('请不要填入特殊字符'))
      } else {
        callback()
      }
    }
    return {
      configList: [],
      service_healthy_type: 'tcp',
      service_healthy_type2: 'tcp',
      compile_exe: 'mvn-3.6.3-java-1.8.0_202',
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        service_name: [
          { required: true, message: 'service_name is required', trigger: 'blur' },
          { pattern: /^[^\u4e00-\u9fa5]+$/, message: '不允许输入中文', trigger: 'blur' },
          { validator: validateServiceName, message: '只可以输入数字和字母和中横杠', trigger: 'blur' }
        ],
        // service_ports: [{required: true, message: 'service_ports is required', trigger: 'blur'}],
        service_ports_enable: [
          { required: true, message: 'service_ports_enable is required', trigger: 'blur' }
        ],
        service_git: [
          { required: true, message: 'service_git is required', trigger: 'blur' }
        ],
        service_compile: [
          { required: true, message: 'service_compile is required', trigger: 'blur' }
        ],
        service_healthy_enable: [
          { required: true, message: 'service_healthy_enable is required', trigger: 'blur' }
        ],
        service_prometheus_enable: [
          { required: true, message: 'service_prometheus_enable is required', trigger: 'blur' }
        ],
        service_domain_enable: [
          { required: true, message: 'service_domain_enable is required', trigger: 'blur' }
        ],
        service_skywalking_enable: [
          { required: true, message: 'service_skywalking_enable is required', trigger: 'blur' }
        ]
      },
      tempRoute: {}
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }
    this.getConfigList()
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    checkSpecialKey,
    getConfigList() {
      getServiceConfigList().then(response => {
        this.configList = response.data
      })
    },
    fetchData(id) {
      getService(id).then(response => {
        this.postForm = response.data
        // set tagsview title
        // this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    // setTagsViewTitle() {
    //   // const title = '编辑Kubernetes'
    //   // const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
    //   // this.$store.dispatch('tagsView/updateVisitedView', route)
    // },
    setPageTitle() {
      const title = '编辑Kubernetes'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        console.log(valid)
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            updateService(this.postForm.id, this.postForm).then(response => {
              const { message, code } = response
              this.$notify({
                title: '成功',
                message: `修改成功： ${message},代码：${code}`,
                type: 'success',
                duration: 2000
              })
              this.$router.push({ path: '/config/service' })
            })
          } else {
            createService(this.postForm).then(response => {
              const { message, code } = response
              this.$notify({
                title: '成功',
                message: `新建成功： ${message},代码：${code}`,
                type: 'success',
                duration: 2000
              })
              this.$router.push({ path: '/config/service' })
            })
          }
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.name.length === 0 || this.postForm.content.length === 0) {
        this.$message({
          message: '请填写必要的名称和配置',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },
    addPort() {
      this.postForm.service_ports.push({
        name: '',
        port: 80,
        protocol: 'TCP',
        source: 8080
      })
    },
    removePort(item) {
      const index = this.postForm.service_ports.indexOf(item)
      if (index !== -1) {
        this.postForm.service_ports.splice(index, 1)
      }
    },
    addEnv() {
      this.postForm.service_environment.push({
        key: '',
        value: '',
        type: 'Key'
      })
    },
    removeEnv(item) {
      const index = this.postForm.service_environment.indexOf(item)
      if (index !== -1) {
        this.postForm.service_environment.splice(index, 1)
      }
    }
  }
}
</script>

<!-- <style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.createPost-container {
  position: relative;
  .btn-box{
text-align:right;
padding-right:10%;
}
  .createPost-main-container {
    padding-left:10%;
    padding-right:10%;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 80px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}
.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>

<style>

.CodeMirror {
position: absolute;
top: 80px;
left: 2px;
right: 5px;
bottom: 0px;
padding: 2px;
height: 100%;
overflow-y: auto;
}

</style>
<style lang='scss' scoped>

.code-mirror-div {
position: absolute;
top: 0px;
left: 2px;
right: 5px;
bottom: 0px;
padding: 2px;
.tool-bar {
  top: 20px;
  margin: 20px 2px 0px 10px;

}
}
</style> -->

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;
  .el-input-number{
    width:100%
  }
  .el-select{
    width:100%
  }
  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
<!--<style>-->
<!--.CodeMirror {-->
<!--  position: absolute;-->
<!--  top: 80px;-->
<!--  left: 2px;-->
<!--  right: 5px;-->
<!--  bottom: 0;-->
<!--  padding: 2px;-->
<!--  height: auto;-->
<!--  overflow-y: auto;-->
<!--}-->
<!--</style>-->
<style lang='scss' scoped>

.code-mirror-div {
  position: absolute;
  top: 0;
  left: 2px;
  right: 5px;
  bottom: 0;
  padding: 2px;

  .tool-bar {
    top: 20px;
    margin: 30px 2px 0 20px;
  }
}

el-col {
  margin-right: 200px;
}
</style>
